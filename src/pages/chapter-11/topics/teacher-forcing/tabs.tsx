import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The training shortcut that created a new problem</h2>
            <p>
                Teacher forcing is one of the most practically important techniques in sequence
                generation — and one of the best examples of a fix that works so well it exposes
                a deeper problem. It makes training reliable and fast, then creates a discrepancy
                between training and inference that researchers have been managing ever since.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1989</div>
                    <div className="ch-tl-section-label">Origin</div>
                    <div className="ch-tl-title">Williams & Zipser — "A Learning Algorithm for Continually Running Fully Recurrent Neural Networks"</div>
                    <div className="ch-tl-body">
                        Ronald Williams and David Zipser formalised teacher forcing in the context of training
                        fully connected recurrent networks. They noted that feeding true outputs as
                        inputs during training — rather than the network's own predictions — dramatically
                        stabilises and accelerates learning. The technique was practical necessity: early in
                        training, the network's predictions are garbage, and feeding garbage back as input
                        makes the gradient signal incoherent. The paper named this "teacher forcing" after
                        the intuition of a teacher correcting a student's mistakes in real time.
                    </div>
                    <div className="ch-tl-impact">Impact: Named and formalised a technique used implicitly since the early days of RNNs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Standard practice</div>
                    <div className="ch-tl-title">Seq2seq models adopt teacher forcing universally</div>
                    <div className="ch-tl-body">
                        Both Sutskever et al. and Cho et al. trained their seq2seq models with teacher
                        forcing at ratio 1.0 (always feed ground truth). This made training stable
                        for multi-layer LSTMs on long sequences. The implicit assumption: the model
                        would generalise to using its own outputs during inference without degradation.
                        In practice, this assumption was optimistic for longer sequences.
                    </div>
                    <div className="ch-tl-impact">Impact: Teacher forcing became the de facto standard for all seq2seq training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Problem recognised and addressed</div>
                    <div className="ch-tl-title">Bengio et al. — Scheduled Sampling</div>
                    <div className="ch-tl-body">
                        Samy Bengio and colleagues at Google published "Scheduled Sampling for Sequence
                        Prediction with Recurrent Neural Networks." They formalised the exposure bias
                        problem: at inference, the model conditions on its own (imperfect) predictions,
                        but was trained on ground truth tokens. Errors compound over time. Their fix —
                        scheduled sampling — gradually replaced ground-truth inputs with model predictions
                        as training progressed, using an annealing schedule.
                    </div>
                    <div className="ch-tl-impact">Impact: Formalised exposure bias; scheduled sampling became widely adopted</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Alternative approaches</div>
                    <div className="ch-tl-title">Professor Forcing — Lamb et al.</div>
                    <div className="ch-tl-body">
                        Alex Lamb and colleagues at Bengio's lab proposed "Professor Forcing," using a
                        GAN-like discriminator to make the network's hidden state dynamics during
                        free-running inference match those during teacher-forced training. Rather than
                        mixing ground-truth and predicted tokens, professor forcing operates on the
                        hidden state representations themselves.
                    </div>
                    <div className="ch-tl-impact">Impact: Opened the direction of adversarial training for closing train/inference gaps</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The exposure bias tension:</strong> Teacher forcing at ratio 1.0 is optimal
                for training stability but creates maximum train/inference discrepancy. Teacher forcing
                at ratio 0.0 (free running) is optimal for inference alignment but makes early training
                intractable. Scheduled sampling and similar techniques navigate this tension — but the
                Transformer architecture sidesteps it entirely via parallel training on full sequences.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The training wheels problem</h2>

            <Analogy label="Learning to Write with Tracing Paper">
                Imagine you're learning to write the alphabet. At first, you use tracing paper —
                you can see the correct letter underneath and just follow it. You learn very quickly
                because you always know exactly what shape to make next.
                <br /><br />
                But when the tracing paper is removed and you write freely, you make some mistakes.
                And here's the problem: once you make one wrong letter, the spacing of all the
                following letters is off. One mistake cascades into many.
                <br /><br />
                Teacher forcing is tracing paper. During training, the model always sees the correct
                previous word, so it learns quickly and stably. At test time, there's no tracing
                paper — it has to use its own outputs. And mistakes compound.
            </Analogy>

            <Analogy label="The Karaoke Machine">
                In karaoke, the lyrics scroll across the screen so you always know the next line.
                You practice with the lyrics showing. When the lyrics disappear for a surprise
                section, you might stumble — you never trained without them.
                <br /><br />
                Teacher forcing is the karaoke lyrics. The decoder is trained knowing the correct
                previous word at every step. At inference, the lyrics are gone. The model has to
                remember what it just said, and if it made a mistake two words ago, it might
                go completely off-track.
            </Analogy>

            <Analogy label="Scheduled Sampling: Gradual Removal">
                Scheduled sampling is like a teacher who starts by letting you trace, then
                gradually removes the tracing paper. In week 1, you always trace. Week 2,
                sometimes the paper is there, sometimes not. By week 8, you never trace.
                <br /><br />
                By gradually training the model to work with its own outputs, you prepare it
                for inference without sacrificing the training stability benefits of teacher forcing.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Training mode vs inference mode — and why they differ</h2>

            <h3>Training Mode: Teacher Forced</h3>
            <p>
                During training, at decoder step t, the input is the true target token y<sub>t-1</sub>
                from the training corpus — regardless of what the model predicted at step t-1.
                If the model predicted the wrong word, it still receives the correct word as
                its next input. This has two key benefits:
            </p>
            <ul>
                <li><strong>Stability:</strong> gradients are clean — the loss at step t reflects only the prediction at step t, not cascading errors from earlier steps</li>
                <li><strong>Speed:</strong> the model can be trained on all timesteps in parallel (the correct targets are known in advance), rather than sequentially waiting for each prediction</li>
            </ul>

            <h3>Inference Mode: Free Running</h3>
            <p>
                During inference, there is no ground truth to refer to. The input at step t is the
                model's own prediction ŷ<sub>t-1</sub> from the previous step. If the model made
                a wrong prediction, that error propagates — the wrong word becomes the context for
                generating the next word, which is now more likely to be wrong, and so on.
            </p>

            <h3>The Exposure Bias Problem</h3>
            <p>
                The model was trained on a distribution of inputs (ground truth tokens), but at
                inference it sees a completely different distribution (its own outputs). This
                mismatch is called <strong>exposure bias</strong>. It's most damaging for long
                sequences, where small early errors can cascade into globally incoherent outputs.
            </p>

            <h3>Scheduled Sampling</h3>
            <p>
                Bengio et al.'s scheduled sampling uses a mixing probability ε<sub>i</sub> that
                decays during training. At step i of training:
            </p>
            <ul>
                <li>With probability ε<sub>i</sub>: use the ground truth token (teacher forced)</li>
                <li>With probability 1 − ε<sub>i</sub>: use the model's own prediction (free running)</li>
                <li>ε<sub>i</sub> starts at 1 and decays toward 0 as training progresses</li>
            </ul>
            <p>
                Early training is fully teacher-forced (stable gradients). Late training
                increasingly uses model predictions (closing the train/inference gap).
            </p>

            <div className="ch-callout">
                <strong>The Transformer's solution:</strong> The Transformer (Ch. 14) sidesteps
                teacher forcing entirely at training time by processing all target positions
                in parallel (masked self-attention ensures position t only attends to positions
                &lt;t). At inference it's still autoregressive, but training is purely parallel
                and much faster. This was one of the key practical advantages of the Transformer
                over LSTM-based seq2seq.
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
            <h2>MLE training, scheduled sampling, and the exposure gap</h2>

            <DefBlock label="MLE Training with Teacher Forcing">
                The maximum likelihood training objective for a seq2seq model with teacher forcing is:
                L(θ) = −∑<sub>t=1</sub><sup>T'</sup> log P<sub>θ</sub>(y<sub>t</sub> | y<sub>1</sub>, ..., y<sub>t-1</sub>, x)
                where each y<sub>t-1</sub> is a <em>ground truth</em> token, not the model's prediction.
                This factorisation assumes access to the full gold reference at training time.
            </DefBlock>

            <h3>Free Running Inference</h3>
            <MathBlock tex="\hat{y}_t = \arg\max_{w} P_\theta(w \mid \hat{y}_1, \ldots, \hat{y}_{t-1},\, x)" />
            <p>
                At inference, each ŷ<sub>t</sub> is the model's own argmax prediction. The
                distribution the model conditions on is now P<sub>θ</sub>(ŷ<sub>1</sub>)·P<sub>θ</sub>(ŷ<sub>2</sub>|ŷ<sub>1</sub>)·... — a
                different distribution than the training-time ground truth distribution.
            </p>

            <h3>Scheduled Sampling Schedule</h3>
            <p>
                Bengio et al. proposed three decay schedules for ε<sub>i</sub> (probability of
                using ground truth at training iteration i):
            </p>
            <MathBlock tex="\varepsilon_i^{\text{linear}} = \max(\varepsilon_{\min},\; k - ci)" />
            <MathBlock tex="\varepsilon_i^{\text{exp}} = k^i, \quad k \in (0, 1)" />
            <MathBlock tex="\varepsilon_i^{\text{inverse sigmoid}} = \frac{k}{k + \exp(i/k)}" />
            <p>
                In all schedules, ε<sub>i</sub> → 0 as training progresses, transitioning from
                pure teacher forcing to pure free running. The inverse sigmoid schedule is the
                most commonly used: it decays slowly at first (keeping training stable), then
                faster as the model improves.
            </p>

            <h3>Expected Training Loss Under Scheduled Sampling</h3>
            <MathBlock tex="\mathcal{L}_{\text{SS}} = -\sum_t \left[\varepsilon_i \log P(y_t \mid y_{<t}) + (1 - \varepsilon_i) \log P(y_t \mid \hat{y}_{<t})\right]" />
            <p>
                The first term is the standard teacher-forced cross-entropy. The second term
                conditions on the model's own predictions. As ε<sub>i</sub> → 0, the loss
                converges to the free-running training objective.
            </p>

            <div className="ch-callout">
                <strong>Minimum risk training (MRT)</strong> is an alternative that optimises
                the expected BLEU score directly rather than the per-token cross-entropy.
                It samples multiple translations from the model, computes BLEU for each,
                and trains toward high-BLEU outputs. MRT sidesteps the exposure bias problem
                but is more expensive to compute and less stable to train.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import random
import math

# ── Simple teacher forcing training loop ─────────────────────────────────────

def train_step(model, src, trg, optimizer, criterion,
               teacher_forcing_ratio=0.5):
    """
    One training step with configurable teacher forcing ratio.
    teacher_forcing_ratio=1.0: always use ground truth (fully teacher-forced)
    teacher_forcing_ratio=0.0: always use model's own output (free running)
    teacher_forcing_ratio=0.5: 50/50 mix
    """
    optimizer.zero_grad()

    encoder_hidden = model.encoder(src)        # compress source
    trg_len, batch = trg.shape

    outputs = []
    dec_input = trg[0]                          # <SOS> token
    hidden = encoder_hidden

    for t in range(1, trg_len):
        out, hidden = model.decoder(dec_input, hidden)
        outputs.append(out)

        use_teacher = random.random() < teacher_forcing_ratio
        if use_teacher:
            dec_input = trg[t]                  # ground truth token
        else:
            dec_input = out.argmax(dim=-1)      # model's best prediction

    outputs = torch.stack(outputs)              # [trg_len-1, batch, vocab]
    output_dim = outputs.shape[-1]

    loss = criterion(
        outputs.reshape(-1, output_dim),
        trg[1:].reshape(-1),                    # skip <SOS>
    )
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    optimizer.step()
    return loss.item()

# ── Scheduled sampling annealing schedules ───────────────────────────────────

def epsilon_linear(step, k=10000, c=1e-4, eps_min=0.1):
    return max(eps_min, k - c * step)

def epsilon_exponential(step, k=0.9999):
    return k ** step

def epsilon_inverse_sigmoid(step, k=2000):
    return k / (k + math.exp(step / k))

# ── Demonstrate the decay of ε over training steps ───────────────────────────

print("Scheduled sampling epsilon over training steps:")
print(f"{'Step':>8}  {'Linear':>10}  {'Exp':>10}  {'Inv. Sig.':>10}")
print("-" * 45)

for step in [0, 1000, 5000, 10000, 20000, 50000, 100000]:
    eps_lin = epsilon_linear(step)
    eps_exp = epsilon_exponential(step)
    eps_inv = epsilon_inverse_sigmoid(step)
    print(f"{step:>8}  {eps_lin:>10.4f}  {eps_exp:>10.6f}  {eps_inv:>10.4f}")

print()
print("All schedules converge toward 0 (free running) as training progresses.")
print("Inverse sigmoid decays slowly at first, then accelerates — often preferred.")`

function PythonContent() {
    return (
        <>
            <p>
                A training loop with configurable teacher forcing ratio, plus three scheduled
                sampling annealing schedules (linear, exponential, inverse sigmoid). The table
                shows how each schedule drives ε from 1.0 toward 0 as training progresses.
            </p>
            <CodeBlock code={PY_CODE} filename="teacher_forcing.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const TEACHER_FORCING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
