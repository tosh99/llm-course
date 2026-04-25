import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The training shortcut that created a new problem</h2>
            <p>
                Teacher forcing is one of the most practically important techniques in sequence generation — and one of the best examples of a fix that works so well it exposes a deeper problem. It makes training reliable and fast, then creates a discrepancy between training and inference that researchers have been managing ever since.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1989</div>
                    <div className="ch-tl-section-label">Origin</div>
                    <div className="ch-tl-title">Williams &amp; Zipser — "A Learning Algorithm for Continually Running Fully Recurrent Neural Networks"</div>
                    <div className="ch-tl-body">
                        <p>
                            Ronald Williams and David Zipser formalized teacher forcing in the context of training fully connected recurrent networks. Their paper addressed a specific challenge: early in training, the network's own predictions are essentially random noise. If those random predictions are fed back as the next input, the network receives an incoherent sequence of states — the gradient signal becomes unreliable, learning is unstable, and in the worst case the network never recovers from the initial poor predictions because each poor prediction makes the next one worse.
                        </p>
                        <p>
                            The solution Williams and Zipser proposed was conceptually simple: during training, replace the network's predicted output at step t with the true target value y<sub>t</sub> before feeding it back as the input at step t+1. The network is "forced" by a teacher (the training data) to see correct inputs, regardless of what it would have predicted. This stabilizes learning dramatically — each step's loss depends only on that step's prediction, not on the cascading errors from all previous steps.
                        </p>
                        <p>
                            The name "teacher forcing" captures the intuition precisely: a teacher who corrects a student's mistakes in real time, rather than letting errors compound. Williams and Zipser acknowledged that this created a train/test discrepancy but viewed it as a practical necessity rather than a fundamental problem. Their RNN training context was much simpler than seq2seq, so the discrepancy was less severe. It would take 25 years for the problem to become acute enough to demand systematic study.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Named and formalized teacher forcing; established it as standard RNN training practice for the next 25 years</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Standard practice</div>
                    <div className="ch-tl-title">Seq2seq Models Adopt Teacher Forcing Universally</div>
                    <div className="ch-tl-body">
                        <p>
                            Both Sutskever et al. and Cho et al. trained their seq2seq models with teacher forcing at ratio 1.0 — always feeding ground truth tokens as decoder inputs during training, never using the model's own predictions. This made training stable for multi-layer LSTMs on long sequences with large vocabularies. Without teacher forcing, training 4-layer LSTMs on 40-word sentences would have been computationally intractable — errors in the first few generated tokens would corrupt the decoder's hidden state for all subsequent steps.
                        </p>
                        <p>
                            The parallel training efficiency of teacher forcing was an additional practical benefit. Because the ground truth inputs are known in advance, all decoder time steps can be computed in parallel during the forward pass — the t-th step's computation does not need to wait for the (t-1)-th step to complete. This is the parallelism that made seq2seq training feasible at scale: a 40-step decoding sequence can be processed as a single batch matrix operation when teacher forcing is applied.
                        </p>
                        <p>
                            The implicit assumption was that the model would generalize from teacher-forced training to free-running inference without significant quality degradation. For short sequences this assumption held reasonably well. For long sequences — where each prediction depends on all previous predictions, and one error can cascade through many subsequent tokens — the assumption was optimistic. The seq2seq papers reported results on sentences averaging 20–30 words, where the exposure bias was manageable. The problem would become more apparent as the field moved to longer sequences.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Teacher forcing ratio 1.0 became the de facto standard for all seq2seq training; enabled parallel forward pass computation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Problem formalized</div>
                    <div className="ch-tl-title">Bengio et al. — Scheduled Sampling</div>
                    <div className="ch-tl-body">
                        <p>
                            Samy Bengio, Oriol Vinyals, Navdeep Jaitly, and Noam Shazeer published "Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks" at NeurIPS 2015. The paper formalized what practitioners had noticed informally: there is a systematic distribution mismatch between training and inference. During training, the decoder always receives ground truth tokens from the training corpus. During inference, it receives its own (imperfect) predictions. The statistics of these two distributions are different — at inference time, the model must operate on a distribution of inputs it has never trained on.
                        </p>
                        <p>
                            They named this problem "exposure bias": the model is never exposed during training to the consequences of its own mistakes, so it never learns to recover from them. Errors compound: a mistake at step 5 puts the decoder in a state it was never trained from, making the step-6 prediction likely to be wrong too, further compounding the problem. The longer the sequence, the more severe the compounding.
                        </p>
                        <p>
                            Their proposed solution — scheduled sampling — used an annealing schedule to gradually reduce the fraction of ground truth tokens used during training. Early in training, teacher forcing ratio ε<sub>i</sub> ≈ 1 (mostly ground truth, stable learning). As training progresses, ε<sub>i</sub> decays toward 0 (mostly model predictions, closing the train/inference gap). The decay follows one of several schedule shapes (linear, exponential, inverse sigmoid), with the inverse sigmoid being most commonly used due to its slow initial decay and faster later convergence.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Formalized exposure bias; scheduled sampling adopted widely; opened the systematic study of train/inference discrepancy in seq2seq models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Adversarial approach</div>
                    <div className="ch-tl-title">Professor Forcing — Lamb et al.</div>
                    <div className="ch-tl-body">
                        <p>
                            Alex Lamb, Anirudh Goyal, Ying Zhang, Saizheng Zhang, Aaron Courville, and Yoshua Bengio proposed "Professor Forcing" — an approach that operated on hidden states rather than on input tokens. Instead of mixing ground truth and model predictions at the input level, Professor Forcing used a GAN-like discriminator to encourage the hidden state dynamics during teacher-forced training to match the hidden state dynamics during free-running inference.
                        </p>
                        <p>
                            The intuition: the exposure bias problem manifests in the hidden state — teacher-forced training and free-running inference put the decoder's hidden state in different regions of state space. If we make those regions match using adversarial training, the model's behavior at inference will better reflect its training dynamics. A discriminator network tries to distinguish teacher-forced hidden states from free-running hidden states; the generator (the RNN) is trained to fool the discriminator while also optimizing the sequence prediction loss.
                        </p>
                        <p>
                            Professor Forcing improved performance on several tasks and opened the direction of adversarial training for closing train/inference gaps — a direction that would become important in reinforcement learning from human feedback (RLHF) approaches to aligning language models, where the same train/inference distribution mismatch problem appears in a different guise.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Adversarial approach to closing train/inference gap; conceptually related to later RLHF alignment techniques</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – present</div>
                    <div className="ch-tl-section-label">Transformer era</div>
                    <div className="ch-tl-title">Teacher Forcing in GPT and Modern Autoregressive Models</div>
                    <div className="ch-tl-body">
                        <p>
                            The Transformer (Vaswani et al., 2017) made teacher forcing even more central — and its efficiency advantage even more decisive. In the Transformer decoder, masked self-attention allows all target positions to be processed in parallel during training. The ground truth target sequence is shifted one position and fed as the decoder input; the model predicts all positions simultaneously. Teacher forcing is structurally baked into the Transformer's training algorithm, not a choice.
                        </p>
                        <p>
                            GPT-style language models train entirely under teacher forcing: given a text corpus, predict the next token at every position simultaneously, with each position attending only to previous tokens (via the causal mask). The training objective is identical to teacher-forced seq2seq, applied to the full sequence in one forward pass. The exposure bias problem remains — at inference time, GPT generates autoregressively using its own predictions — but is mitigated by the enormous scale of training data, which makes the model robust to many types of input distributions.
                        </p>
                        <p>
                            Modern fine-tuning approaches like RLHF (Reinforcement Learning from Human Feedback) partially address the exposure bias problem by training models on their own generated text using reward signals from human preferences. This closes the train/inference gap more directly than scheduled sampling — the model is explicitly trained to generate good continuations starting from its own outputs. Teacher forcing remains universal during pre-training; RLHF-style techniques address the gap during fine-tuning.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Teacher forcing is structurally built into all modern LLM training; exposure bias addressed via scale and RLHF rather than scheduled sampling</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The exposure bias tension:</strong> Teacher forcing at ratio 1.0 is optimal
                for training stability but creates maximum train/inference discrepancy. Teacher forcing
                at ratio 0.0 (free running) is optimal for inference alignment but makes early training
                intractable. Scheduled sampling and similar techniques navigate this tension — but the
                Transformer architecture partially sidesteps it via parallel training on full sequences
                and mitigation through massive scale.
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

            <Analogy label="Why Training Is Faster With Teacher Forcing">
                Here's a bonus: teacher forcing doesn't just make training more stable — it also
                makes training faster. Because the correct inputs are known in advance for every
                step, the computer can compute all decoder steps at the same time (in parallel).
                <br /><br />
                Without teacher forcing, you'd have to wait for step 1's output before computing
                step 2, wait for step 2's output before step 3, and so on. With teacher forcing,
                steps 1 through 40 all run simultaneously. For a 40-word sentence, that's a 40×
                speedup in the decoder computation.
            </Analogy>

            <Analogy label="The Exposure Bias Problem">
                Here's the problem with always using tracing paper: when you practice with it,
                you never learn to recover from your own mistakes. If you draw the letter "a" a
                bit crooked, the tracing paper is still there showing the perfect "b" next —
                so you never learn what to do when your own "a" is crooked.
                <br /><br />
                At test time, if you draw a crooked "a," you have to figure out what comes next
                based on your own crooked "a" — a situation you never practiced. The model
                was trained on a distribution (perfect ground truth inputs) that it never
                sees at inference time (its own imperfect outputs). That's exposure bias.
            </Analogy>

            <Analogy label="Scheduled Sampling: Gradual Removal">
                Scheduled sampling is like a teacher who starts by letting you trace, then
                gradually removes the tracing paper. In week 1, you always trace. Week 2,
                sometimes the paper is there, sometimes not. By week 8, you never trace.
                <br /><br />
                By gradually training the model to work with its own outputs, you prepare it
                for inference without sacrificing the training stability benefits of teacher forcing.
                The schedule is carefully tuned: too fast and training destabilizes; too slow and
                you don't close the gap enough before training ends.
            </Analogy>

            <Analogy label="How GPT Handles This">
                Modern language models like GPT have a clever structural solution. They're trained
                to predict the next word given all previous words — but since they see the entire
                training text at once, they don't need to wait for their own predictions at all.
                <br /><br />
                At inference time, they generate one word at a time using their own outputs.
                But because they trained on billions of words in every possible context,
                they've seen so many situations that they can handle their own mistakes gracefully.
                At massive scale, training on enough examples is itself a partial solution to
                the exposure bias problem — the model has seen so many tokens that the distribution
                it encounters at inference is well-covered by training.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Training mode vs inference mode — and why they differ</h2>

            <h3>Training Mode — Teacher Forced</h3>
            <p>
                During training, at decoder step t, the input is the true target token y<sub>t-1</sub>
                from the training corpus — regardless of what the model predicted at step t-1.
                If the model predicted the wrong word, it still receives the correct word as
                its next input. This has two key benefits:
            </p>
            <ul>
                <li><strong>Stability:</strong> gradients are clean — the loss at step t reflects only the prediction at step t, not cascading errors from earlier steps</li>
                <li><strong>Speed:</strong> the model can be trained on all timesteps in parallel (the correct targets are known in advance), rather than sequentially waiting for each prediction</li>
                <li><strong>Convergence:</strong> training converges faster because the gradient signal is not corrupted by early-step errors compounding through the sequence</li>
            </ul>

            <h3>Inference Mode — Free Running</h3>
            <p>
                During inference, there is no ground truth to refer to. The input at step t is the
                model's own prediction ŷ<sub>t-1</sub> from the previous step. If the model made
                a wrong prediction, that error propagates — the wrong word becomes the context for
                generating the next word, which is now more likely to be wrong, and so on.
            </p>
            <MathBlock tex="\hat{y}_t = \arg\max_{w} P_\theta(w \mid \hat{y}_1, \ldots, \hat{y}_{t-1},\, x)" />

            <h3>The Exposure Bias Problem</h3>
            <p>
                The model was trained on a distribution of inputs (ground truth tokens from the corpus),
                but at inference it sees a completely different distribution (its own outputs). This
                distribution mismatch is called <strong>exposure bias</strong>. It's most damaging
                for long sequences, where small early errors can cascade into globally incoherent outputs.
            </p>

            <h3>Scheduled Sampling — Annealing the Gap</h3>
            <p>
                Bengio et al.'s scheduled sampling uses a mixing probability ε<sub>i</sub> that
                decays during training. At training iteration i, for each decoder step:
            </p>
            <ul>
                <li>With probability ε<sub>i</sub>: use the ground truth token (teacher forced)</li>
                <li>With probability 1 − ε<sub>i</sub>: use the model's own prediction (free running)</li>
                <li>ε<sub>i</sub> starts at 1 and decays toward 0 as training progresses</li>
            </ul>
            <MathBlock tex="\varepsilon_i^{\text{inv-sigmoid}} = \frac{k}{k + \exp(i/k)}, \quad k \in [1000, 5000]" />

            <h3>Curriculum Learning Connection</h3>
            <p>
                Scheduled sampling is an instance of curriculum learning — the idea (Bengio et al., 2009)
                that training should progress from easy examples to hard ones. Teacher forcing provides
                easy training (perfect inputs, clean gradients). Free-running training is hard (noisy
                inputs from model's own errors). Scheduling the difficulty to increase gradually is
                exactly the curriculum learning pattern.
            </p>

            <h3>Minimum Risk Training</h3>
            <p>
                An alternative approach: instead of cross-entropy on ground truth tokens, optimise
                the expected BLEU score directly. Sample multiple translations from the model,
                compute BLEU for each, and train toward high-BLEU outputs. This sidesteps exposure
                bias by training on the model's own distribution — but is expensive and unstable.
            </p>
            <MathBlock tex="\mathcal{L}_{\text{MRT}} = \sum_{\hat{y} \sim P_\theta(y \mid x)} P_\theta(\hat{y} \mid x) \cdot \Delta(\hat{y}, y^*)" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>The Transformer's partial solution:</strong> The Transformer (Ch. 16) processes
                all target positions in parallel during training via masked self-attention (position t
                only attends to positions &lt;t). Teacher forcing is structurally built in — ground truth
                tokens are always used during training. At inference it's still autoregressive, but
                massive pre-training scale and RLHF fine-tuning together mitigate the exposure bias
                problem more effectively than scheduled sampling for large models.
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
                distribution the model conditions on is now P<sub>θ</sub>(ŷ<sub>1</sub>)·P<sub>θ</sub>(ŷ<sub>2</sub>|ŷ<sub>1</sub>)·... —
                a different distribution than the training-time ground truth distribution. The KL
                divergence between the training and inference input distributions is the formal
                measure of exposure bias.
            </p>

            <h3>Scheduled Sampling Schedules</h3>
            <p>
                Three decay schedules for ε<sub>i</sub> (probability of using ground truth at training iteration i):
            </p>
            <MathBlock tex="\varepsilon_i^{\text{linear}} = \max(\varepsilon_{\min},\; k - ci)" />
            <MathBlock tex="\varepsilon_i^{\text{exp}} = k^i, \quad k \in (0, 1)" />
            <MathBlock tex="\varepsilon_i^{\text{inverse sigmoid}} = \frac{k}{k + \exp(i/k)}" />
            <p>
                In all schedules, ε<sub>i</sub> → 0 as training progresses. The inverse sigmoid
                decays slowly at first (keeping training stable when the model is weakest), then
                faster as the model improves — a natural match to the training dynamics.
            </p>

            <h3>Expected Training Loss Under Scheduled Sampling</h3>
            <MathBlock tex="\mathcal{L}_{\text{SS}} = -\sum_t \left[\varepsilon_i \log P(y_t \mid y_{<t}) + (1 - \varepsilon_i) \log P(y_t \mid \hat{y}_{<t})\right]" />
            <p>
                The first term is the standard teacher-forced cross-entropy. The second term
                conditions on the model's own predictions. As ε<sub>i</sub> → 0, the loss
                converges to the free-running training objective — closing the exposure gap.
            </p>

            <div className="ch-callout">
                <strong>Minimum risk training (MRT)</strong> is an alternative that optimises
                the expected task metric directly (e.g. BLEU) rather than the per-token cross-entropy:
                L<sub>MRT</sub> = E<sub>ŷ∼Pθ</sub>[Δ(ŷ, y*)]. It sidesteps the exposure bias problem
                by training directly on the model's own output distribution, but is expensive (requires
                sampling multiple translations per sentence) and can be unstable.
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

# ── Demonstrate the decay of epsilon over training steps ─────────────────────

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
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
