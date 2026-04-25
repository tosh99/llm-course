import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                When the ViT paper appeared in October 2020, one of its sharpest criticisms
                was its data hunger. Dosovitskiy et al. had trained their model on JFT-300M
                &mdash; a proprietary Google dataset of 300 million labeled images &mdash;
                before fine-tuning on ImageNet. Without that pre-training, ViT-Base fell
                well short of a comparably sized ResNet. The implication was damning: Vision
                Transformers were only competitive inside Google. DeiT changed that story.
                Published in January 2021 by Hugo Touvron and colleagues at Facebook AI
                Research, <em>Training data-efficient image transformers &amp; distillation
                through attention</em> demonstrated that a ViT-equivalent model could match
                EfficientNet on ImageNet-1k &mdash; just 1.2 million images &mdash; trained
                in 53 hours on a single 8-GPU machine. The recipe combined a carefully
                engineered training procedure with a novel architectural element: a
                distillation token that learned by mimicking a pre-trained CNN teacher.
            </p>

            <div className="ch-timeline">

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-title">Hinton et al. &mdash; "Distilling the Knowledge in a Neural Network"</div>
                    <div className="ch-tl-section-label">The Origin of Knowledge Distillation</div>
                    <div className="ch-tl-body">
                        Geoffrey Hinton, Oriol Vinyals, and Jeff Dean proposed that a large,
                        well-trained teacher network contains far more information than its
                        final hard predictions reveal. When a teacher outputs a probability
                        distribution over all 1,000 ImageNet classes, that distribution encodes
                        the teacher's beliefs about inter-class similarity. A soft label of
                        82% cat, 15% cougar, 3% fox is far more informative than the hard
                        label "cat" &mdash; it reveals that cats and cougars share visual
                        features that the teacher has learned. Training a smaller student on
                        these soft targets, produced at a raised temperature T &gt; 1 to
                        amplify the signal in the non-maximum probabilities, transfers
                        relational knowledge that one-hot labels discard entirely.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Established the conceptual and mathematical framework for
                        all subsequent distillation work, including DeiT's distillation token
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 &ndash; 2020</div>
                    <div className="ch-tl-title">Knowledge Distillation Becomes Standard for CNN Compression</div>
                    <div className="ch-tl-section-label">The CNN Era of Distillation</div>
                    <div className="ch-tl-body">
                        Distillation became the standard recipe for compressing CNNs: train a
                        large ResNet or EfficientNet teacher, then use its soft outputs to
                        supervise a smaller MobileNet or SqueezeNet student. Techniques
                        accumulated: feature-level distillation (matching intermediate
                        activations, not just output logits), attention transfer, and
                        relational distillation. But these methods were all CNN-to-CNN
                        transfers. Using a CNN teacher to teach a Vision Transformer student
                        &mdash; architectures with fundamentally different inductive biases
                        &mdash; was an unexplored idea. Touvron et al. were the first to
                        show that a CNN's inductive biases could be distilled into a ViT,
                        and that this cross-architecture transfer was especially effective.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Built the toolbox DeiT would draw on; established that
                        distillation is a general-purpose training technique, not CNN-specific
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">October 2020</div>
                    <div className="ch-tl-title">ViT Paper Reveals the Data Dependence</div>
                    <div className="ch-tl-section-label">The Problem DeiT Set Out to Solve</div>
                    <div className="ch-tl-body">
                        Dosovitskiy et al. published "An Image is Worth 16&times;16 Words"
                        and showed that a pure Transformer encoder applied to image patches
                        could match or exceed ResNet-Big on ImageNet &mdash; but only after
                        pre-training on JFT-300M or ImageNet-21k (14M images). Trained on
                        ImageNet-1k alone, ViT-Base achieved 77.9% top-1, compared to
                        ResNet-50's 76.5% and EfficientNet-B7's 84.3%. The gap was vast.
                        The authors acknowledged that ViT lacked CNNs' inductive biases
                        (locality, translation equivariance) and required substantially more
                        data to overcome this deficit. The community responded with a pointed
                        question: is ViT's data hunger a fundamental property of the
                        architecture, or a training methodology failure?
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Defined the central challenge that DeiT directly answered;
                        sparked a wave of data-efficient ViT research
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">January 2021</div>
                    <div className="ch-tl-title">DeiT &mdash; Touvron et al., Facebook AI Research</div>
                    <div className="ch-tl-section-label">The Three Contributions</div>
                    <div className="ch-tl-body">
                        The DeiT paper made three distinct contributions. First, a strong
                        training recipe that made ViT competitive on ImageNet-1k without any
                        external data: aggressive augmentation (RandAugment, CutMix, MixUp,
                        Repeated Augment), careful regularization (stochastic depth, label
                        smoothing &#949; = 0.1), and a 300-epoch cosine-decay AdamW schedule.
                        This recipe alone closed much of the gap to CNNs. Second, and more
                        architecturally novel, a distillation token &mdash; a third learnable
                        vector prepended to the patch sequence alongside [CLS]. The
                        distillation token is supervised by the hard predictions of a RegNetY
                        CNN teacher rather than by ground-truth labels, while [CLS] is
                        supervised by ground-truth labels as usual. Third, a systematic
                        analysis of three model variants: DeiT-Ti (5M params), DeiT-S (22M),
                        and DeiT-B (86M), showing that DeiT-S matches ResNet-50 at a
                        comparable parameter count, and DeiT-B (with distillation) matches
                        ViT-Base trained on JFT-300M.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Democratized ViT research; any lab with an 8-GPU server and
                        ImageNet could now train competitive Vision Transformers
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-title">Distillation Token Analysis: Two Tokens, Two Views</div>
                    <div className="ch-tl-section-label">What the Tokens Learn</div>
                    <div className="ch-tl-body">
                        A key finding from the DeiT paper was that the distillation token
                        learns qualitatively different representations than the [CLS] token,
                        even though they have identical architectures and both attend over
                        the same patch sequence. The [CLS] token responds most strongly to
                        global semantic structure matching ground-truth labels; it is sensitive
                        to the category-level content of the image. The distillation token
                        responds to the mid-level visual features the CNN teacher found
                        discriminative &mdash; local textures, edges, and patterns that CNNs
                        preferentially encode due to their inductive biases. Visualizing
                        attention maps showed that [CLS] and distillation token attention
                        were complementary: they focused on different image regions. When the
                        two heads' predictions were averaged at inference time, accuracy was
                        consistently higher than either head alone, confirming the tokens
                        provide genuinely independent information.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Showed that distillation injects CNN-like inductive biases
                        into ViT without architectural changes; the two tokens are genuinely
                        complementary
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 &ndash; 2023</div>
                    <div className="ch-tl-title">DeiT Becomes the ViT Baseline</div>
                    <div className="ch-tl-section-label">Standardization of the Training Recipe</div>
                    <div className="ch-tl-body">
                        DeiT's three model variants (DeiT-Ti, DeiT-S, DeiT-B) rapidly became
                        the standard ImageNet benchmark points for ViT-scale papers. BEiT,
                        MAE, DINO, CLIP, and dozens of subsequent works either used DeiT
                        architectures as backbones or explicitly compared to DeiT's numbers.
                        The training recipe was so carefully engineered that it proved more
                        durable than the distillation mechanism itself: papers that ablated
                        away the distillation token but kept DeiT's augmentation and
                        regularization still saw major improvements over naive ViT training.
                        This identified the training recipe as the primary contribution, with
                        distillation offering a complementary boost.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Established the experimental baseline that defined a generation
                        of ViT research; the DeiT recipe influenced training practices across
                        vision, multimodal, and language domains
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-title">DeiT-III &mdash; Revisiting the Recipe Without Distillation</div>
                    <div className="ch-tl-section-label">The Recipe Is More Fundamental Than the Token</div>
                    <div className="ch-tl-body">
                        Touvron et al. returned with DeiT-III, removing the distillation
                        token entirely and instead refining the training recipe: an Inception
                        crop augmentation strategy (3-Augment: grayscale, solarization, Gaussian
                        blur), LayerScale initialization for deep ViTs, and simple random
                        resized crop without complex mixup. DeiT-III outperformed both the
                        original DeiT and many distillation-based successors, confirming that
                        the strong training methodology was more fundamental than the
                        distillation mechanism. This completed the full arc: DeiT showed ViT
                        could be data-efficient; DeiT-III showed the specific mechanism of
                        that efficiency was careful training, not distillation per se.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Closed the loop on DeiT's research program; validated that
                        training recipe engineering is a first-class research contribution,
                        not merely an engineering detail
                    </div>
                </div>

            </div>

            <div className="ch-callout">
                <strong>The DeiT lesson:</strong> ViT's data hunger was not architectural
                inevitability &mdash; it was a training methodology gap. The right combination
                of data augmentation, regularization, and a CNN teacher's knowledge could
                compress what JFT-300M provided into a 3-day training run on 8 GPUs. DeiT
                democratized Vision Transformers and proved that inductive biases need not be
                baked into architecture; they can be taught through distillation.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>DeiT: Teaching a Vision Transformer to Learn Faster</h2>

            <Analogy label="The Expert Teacher Problem">
                Imagine you want to teach a new student everything about recognizing animals.
                The old way (ViT) was to give the student access to a library with 300 million
                labeled animal pictures &mdash; a gigantic private library that only one
                school (Google) owned. Without that library, the student performed badly.
                <br /><br />
                The new student (ViT) had no built-in rules about what makes a cat a cat. A
                human brain automatically pays attention to nearby things &mdash; if a pixel
                is part of a cat's ear, the pixels next to it are probably also part of the
                cat. ViT doesn't know this; it has to figure it out from scratch. That's why
                it needed to see 300 million examples. DeiT asked: what if we could teach
                those rules faster using a smarter teaching method?
            </Analogy>

            <Analogy label="Asking a CNN to Teach">
                DeiT's big idea was to hire a CNN as a tutor. CNNs are older models that
                have built-in rules about images &mdash; they automatically know that nearby
                pixels matter. A CNN trained on ImageNet is already very good at recognizing
                images.
                <br /><br />
                So DeiT let the CNN tutor watch each training image and write down not just
                the answer ("this is a cat") but also how confident it was about every
                single class: "90% cat, 8% leopard, 2% jaguar." Then DeiT trained the new
                ViT student to match what the CNN tutor wrote &mdash; learning the CNN's
                rules through imitation, not by reading millions of extra books.
            </Analogy>

            <Analogy label="The Three Seats on the School Bus">
                In normal ViT, there is one special seat on the bus called [CLS]. This seat
                doesn't carry image patches; instead, it listens to all the other seats and
                at the end of the ride, announces what the image is.
                <br /><br />
                DeiT added a second special seat: the distillation token. The [CLS] seat
                learns from the correct answer (the real label). The distillation seat learns
                from what the CNN tutor thinks. At the end of the ride, you ask both special
                seats for their opinion and average them together. Two independent guesses are
                usually better than one, especially when they learned from different teachers.
            </Analogy>

            <Analogy label="Soft Labels Are Richer Lessons">
                Imagine two teachers marking your test. Teacher A writes: "Wrong &mdash; it's
                a cat." Teacher B writes: "85% cat, 12% leopard, 3% tiger &mdash; you were on
                the right track, cats and leopards are visually similar." Teacher B's feedback
                is so much more useful!
                <br /><br />
                DeiT's CNN teacher gives Teacher B feedback. Even when the student gets the
                answer right, the soft label teaches something extra: which other animals look
                similar, which textures overlap, which colors cluster together. This is called
                knowledge distillation because the teacher's knowledge is being poured into
                the student like water into a bottle.
            </Analogy>

            <Analogy label="Making the Training Harder to Make the Model Stronger">
                DeiT also used something like athletic cross-training. Instead of showing the
                student the same cat photo every time, it:
                <br /><br />
                &mdash; Pasted a piece of a dog photo onto the cat photo (CutMix)
                <br />
                &mdash; Blended two images together like a double exposure (MixUp)
                <br />
                &mdash; Randomly rotated, flipped, brightened, and darkened images
                (RandAugment)
                <br /><br />
                Like a sports coach who makes athletes practice in rain, mud, and heat, these
                harder versions made the ViT student more robust. When it saw a perfectly
                clear photo during the real test, it had no trouble at all &mdash; it had
                already practiced on much harder versions.
            </Analogy>

            <Analogy label="Why 3 Days on 8 GPUs Was Revolutionary">
                Before DeiT, training a competitive Vision Transformer meant renting Google's
                private 300-million-image library and running computations for weeks or months.
                Only the biggest companies could afford it.
                <br /><br />
                DeiT showed the same result could be achieved in 3 days on 8 consumer GPUs,
                using a dataset anyone could download for free (ImageNet-1k). Suddenly,
                university research labs, small startups, and individual researchers could
                train Vision Transformers. It's like discovering that you can get the same
                fitness level with a neighborhood gym as you could with an Olympic training
                center &mdash; if you follow the right workout plan.
            </Analogy>

            <div className="ch-callout">
                <strong>The one-sentence version:</strong> DeiT proved that Vision Transformers
                don't need 300 million images to be great &mdash; they just needed a smarter
                teacher (a CNN), tougher practice (data augmentation), and a special extra
                student seat (the distillation token) that learns from the teacher's opinions
                rather than the official answer key.
            </div>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>DeiT: Data-Efficient Vision Transformers</h2>

            <p>
                DeiT addressed a fundamental question: why does ViT need 300 million
                images when ResNet achieves strong results on 1.2 million? The answer
                turned out to be twofold &mdash; a weak training recipe and the absence
                of inductive biases. DeiT fixed both with knowledge distillation and
                aggressive data augmentation, achieving 85.2% top-1 on ImageNet with
                DeiT-B (distilled) trained on ImageNet-1k alone.
            </p>

            <h3>Knowledge Distillation: Soft Targets</h3>
            <p>
                Hinton's temperature-softened softmax converts a teacher's raw logits
                <em> z</em> into informative probability distributions. At temperature T,
                the soft label for class i is:
            </p>
            <MathBlock tex="q_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}" />
            <p>
                At T = 1, this is the standard softmax &mdash; outputs are sharply peaked
                around the highest-logit class. At T = 3 or T = 4, the denominator grows
                more slowly, and the distribution becomes softer. Non-maximum probabilities
                (e.g., the teacher's 12% confidence that a golden retriever image might also
                be a Labrador) are amplified by the higher temperature, making them
                informative training signal rather than near-zero noise. This inter-class
                relational information is precisely what hard one-hot labels discard.
            </p>

            <DefBlock label="Hard vs. Soft Distillation">
                DeiT supports two distillation modes. In <strong>hard-label distillation</strong>,
                the teacher's argmax prediction is used as a hard label for the distillation
                head &mdash; the distillation token is trained with standard cross-entropy
                against the teacher's top-1 class. In <strong>soft distillation</strong>,
                the teacher's full probability distribution (at temperature T &gt; 1) is used,
                and the loss is a KL divergence between the student's distribution and the
                teacher's soft distribution. The original DeiT paper found hard-label
                distillation slightly outperformed soft distillation in practice.
            </DefBlock>

            <h3>The DeiT Training Objective</h3>
            <p>
                The total loss combines the ground-truth classification loss (on the [CLS]
                token) and the distillation loss (on the distillation token):
            </p>
            <MathBlock tex="\mathcal{L} = (1 - \lambda)\,\mathcal{L}_{CE}(\hat{y}_{cls},\, y_{true}) \;+\; \lambda\,\mathcal{L}_{CE}(\hat{y}_{dist},\, y_{teacher})" />
            <p>
                where &#955; balances ground-truth learning against teacher imitation,
                <em> y&#770;</em>&#8202;<sub>cls</sub> and <em> y&#770;</em>&#8202;<sub>dist</sub>
                are the softmax outputs of the [CLS] and distillation classification heads
                respectively, <em>y</em><sub>true</sub> is the one-hot ground-truth label,
                and <em>y</em><sub>teacher</sub> is the teacher's prediction (either hard
                argmax or soft distribution). For soft distillation, the second term becomes
                a KL divergence at temperature T:
            </p>
            <MathBlock tex="\mathcal{L}_{soft} = (1-\lambda)\,\mathcal{L}_{CE}(\hat{y}_{cls}, y_{true}) \;+\; \lambda \cdot T^2 \cdot \mathrm{KL}\!\left(\hat{q}_{dist} \;\|\; q_{teacher}\right)" />
            <p>
                The T&#178; factor rescales the gradient magnitudes to account for the
                temperature scaling applied to both distributions.
            </p>

            <h3>The Distillation Token</h3>
            <p>
                Mechanically, the distillation token is identical to the [CLS] token: a
                learnable vector of dimension D, prepended to the patch sequence at position
                1 (after [CLS] at position 0). The full input sequence to the Transformer
                encoder is therefore:
            </p>
            <MathBlock tex="z_0 = [\,x_{cls};\; x_{dist};\; x_p^1 E;\; x_p^2 E;\; \ldots;\; x_p^N E\,] + E_{pos}" />
            <p>
                Both [CLS] and distillation tokens participate in every self-attention layer,
                attending to all patch tokens and to each other. After the final encoder
                layer and LayerNorm, two separate MLP heads produce predictions:
            </p>
            <ul>
                <li><strong>Classification head:</strong> operates on <em>z</em>&#8202;<sub>L</sub>[0] (the [CLS] token), trained against ground-truth labels</li>
                <li><strong>Distillation head:</strong> operates on <em>z</em>&#8202;<sub>L</sub>[1] (the distillation token), trained against the teacher's predictions</li>
            </ul>
            <p>
                At inference time, both heads produce a class probability vector. The two
                vectors are summed (not averaged &mdash; the softmax is applied after summing
                the logits), and the argmax gives the final prediction.
            </p>

            <h3>DeiT's Training Recipe</h3>
            <p>
                The training recipe is as important as the distillation mechanism. Key
                hyperparameters for DeiT-S (22M parameters):
            </p>
            <ul>
                <li>
                    <strong>Augmentation:</strong> RandAugment (n=2, m=9), MixUp (&#945;=0.8),
                    CutMix (&#945;=1.0), Repeated Augment (2 views per image per epoch),
                    random erasing (p=0.25)
                </li>
                <li>
                    <strong>Regularization:</strong> Stochastic depth (drop&#8202;_&#8202;path&#8202;_&#8202;rate=0.1),
                    label smoothing (&#949;=0.1), dropout=0.0 (stochastic depth replaces it)
                </li>
                <li>
                    <strong>Optimizer:</strong> AdamW, lr=1&times;10<sup>&minus;3</sup>,
                    weight&#8202;_&#8202;decay=0.05, cosine decay, 300 epochs, batch size 1024,
                    5-epoch linear warmup
                </li>
                <li>
                    <strong>Teacher:</strong> RegNetY-16GF (84.0% top-1 on ImageNet,
                    no fine-tuning from external data)
                </li>
            </ul>

            <h3>Teacher Choice: CNN vs. ViT</h3>
            <p>
                Touvron et al. systematically compared CNN teachers (RegNetY family) against
                ViT teachers. The CNN teacher consistently produced better DeiT students.
                The hypothesis: CNNs have strong local texture and edge inductive biases that
                ViTs lack. When a ViT student is distilled from a CNN teacher, the distillation
                token acquires CNN-like feature representations &mdash; attention maps for the
                distillation token resemble CNN feature maps, while [CLS] attention remains
                more globally distributed. The two tokens thus represent genuinely different
                visual processing strategies, making their combined prediction more accurate
                than either alone.
            </p>
            <p>
                Using a ViT teacher instead gave 83.4% top-1 vs. 85.2% for the CNN teacher
                (DeiT-B, distilled). This cross-architecture complementarity is one of DeiT's
                most practically useful findings: a CNN teacher is a better partner for ViT
                training than a ViT teacher is.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">KL divergence &middot; temperature sharpness &middot; gradient analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">DeiT training loop &middot; distillation token &middot; combined loss</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>DeiT: Mathematical Foundations</h2>

            <h3>KL Divergence in Soft Distillation</h3>
            <p>
                The soft distillation loss is the KL divergence between the student's
                temperature-softened distribution and the teacher's temperature-softened
                distribution. For distributions P (teacher) and Q (student) over K classes:
            </p>
            <MathBlock tex="\mathrm{KL}(P \| Q) = \sum_{k=1}^{K} p_k \log \frac{p_k}{q_k}" />
            <p>
                where p&#8202;<sub>k</sub> and q&#8202;<sub>k</sub> are teacher and student
                class probabilities at temperature T:
            </p>
            <MathBlock tex="p_k = \frac{\exp(z_k^{teacher} / T)}{\sum_j \exp(z_j^{teacher} / T)}, \qquad q_k = \frac{\exp(z_k^{student} / T)}{\sum_j \exp(z_j^{student} / T)}" />
            <p>
                The KL divergence is asymmetric: KL(P&#8202;&#8214;&#8202;Q) penalizes the
                student for placing low probability on classes the teacher rated highly. This
                is the desired behavior: the student must respect the teacher's confidence,
                not just match its top prediction.
            </p>

            <h3>Temperature and Gradient Magnitude</h3>
            <p>
                To understand why the T&#178; factor appears in the loss, consider the gradient
                of the soft distillation loss with respect to student logit z&#8202;<sub>i</sub>.
                At temperature T, the softmax Jacobian has entries of order 1/T, so the
                gradient of the cross-entropy loss scales as 1/T. The soft distillation loss
                therefore contributes gradients of order 1/T&#178; compared to the hard-label
                loss. Multiplying by T&#178; restores gradient magnitudes to the same scale
                as the hard-label cross-entropy, allowing a single learning rate to balance
                both terms:
            </p>
            <MathBlock tex="\frac{\partial}{\partial z_i} \left[ T^2 \cdot \mathrm{KL}(P \| Q) \right] \approx \frac{\partial}{\partial z_i} \mathcal{L}_{CE}(y_{true})" />
            <p>
                This is Hinton's original scaling argument. The T&#178; factor ensures that
                changing the temperature parameter does not require re-tuning &#955; or the
                learning rate.
            </p>

            <h3>Temperature-Sharpness Trade-Off</h3>
            <p>
                Define the entropy of the teacher's soft label at temperature T:
            </p>
            <MathBlock tex="H(T) = -\sum_k p_k(T) \log p_k(T)" />
            <p>
                At T &#8594; 1 (standard softmax), H is low: the distribution is sharp, most
                probability mass is on the top class. At T &#8594; &#8734;, H &#8594; log K:
                the distribution approaches uniform. The training signal from soft labels is
                proportional to their entropy. Too low T, and soft labels collapse to hard
                labels, defeating the purpose of distillation. Too high T, and the teacher's
                class ordering signal is washed out in near-uniform noise. DeiT found T = 3
                or T = 4 gives a good balance: enough entropy to communicate inter-class
                relationships, but enough sharpness to maintain the teacher's preferences.
            </p>
            <MathBlock tex="\text{Optimal } T: \quad T^* = \arg\max_T \;\mathcal{I}(y_{true};\, q_{student}(T))" />
            <p>
                where &#8544;(&#8729;) denotes mutual information. In practice, T = 3&ndash;4
                is empirically near-optimal for ImageNet-scale distillation.
            </p>

            <h3>Stochastic Depth (Drop-Path)</h3>
            <p>
                DeiT uses stochastic depth (Huang et al., 2016) as its primary regularizer
                instead of dropout. In a Transformer with L blocks, block &#8467; is dropped
                with probability p&#8202;<sub>&#8467;</sub> during training. The schedule is
                linear: the first block is almost never dropped, the last block is dropped
                most frequently:
            </p>
            <MathBlock tex="p_\ell = \frac{\ell}{L} \cdot p_{max}, \qquad \ell = 1, \ldots, L" />
            <p>
                For DeiT-S, p&#8202;<sub>max</sub> = 0.1. The expected output of block &#8467;
                is:
            </p>
            <MathBlock tex="\mathbb{E}[x_\ell^{out}] = (1 - p_\ell)\, f_\ell(x_\ell^{in}) + p_\ell \cdot x_\ell^{in}" />
            <p>
                At test time, all blocks are always active and the residual connection is
                scaled by (1 &minus; p&#8202;<sub>&#8467;</sub>) to compensate for the training
                dropout. Stochastic depth acts as a form of implicit ensemble: different
                subsets of blocks are active in each forward pass, and the full network at
                test time aggregates their predictions.
            </p>

            <h3>MixUp and CutMix Loss</h3>
            <p>
                MixUp creates a virtual training example by linearly interpolating two
                images and their labels:
            </p>
            <MathBlock tex="\tilde{x} = \lambda x_i + (1-\lambda) x_j, \qquad \tilde{y} = \lambda y_i + (1-\lambda) y_j, \qquad \lambda \sim \mathrm{Beta}(\alpha, \alpha)" />
            <p>
                CutMix replaces a rectangular region of one image with the corresponding
                region from another, with labels mixed proportionally to the area ratio
                r = (1 &minus; &#955;):
            </p>
            <MathBlock tex="\tilde{y} = (1-r)\, y_i + r\, y_j, \qquad r = \frac{W_{box} \cdot H_{box}}{W \cdot H}, \qquad r \sim \mathrm{Beta}(1, 1)" />
            <p>
                Both methods produce mixed labels that are not one-hot, which naturally
                complements label smoothing and soft distillation targets. The model learns
                to output calibrated distributions rather than sharp one-hot predictions,
                making it more compatible with the soft-label training regime.
            </p>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

# ── DeiT: Distillation Token + Combined Loss ───────────────────────────────────

class PatchEmbedding(nn.Module):
    """Splits image into patches and projects each to embed_dim."""
    def __init__(self, img_size=224, patch_size=16, in_chans=3, embed_dim=384):
        super().__init__()
        self.num_patches = (img_size // patch_size) ** 2
        self.proj = nn.Conv2d(
            in_chans, embed_dim,
            kernel_size=patch_size, stride=patch_size
        )

    def forward(self, x):
        # (B, C, H, W) -> (B, N, D)
        x = self.proj(x).flatten(2).transpose(1, 2)
        return x


class DeiTBlock(nn.Module):
    """Standard Transformer encoder block with stochastic depth."""
    def __init__(self, embed_dim=384, num_heads=6, mlp_ratio=4.0, drop_path=0.0):
        super().__init__()
        self.norm1 = nn.LayerNorm(embed_dim)
        self.attn = nn.MultiheadAttention(
            embed_dim, num_heads, batch_first=True
        )
        self.norm2 = nn.LayerNorm(embed_dim)
        self.mlp = nn.Sequential(
            nn.Linear(embed_dim, int(embed_dim * mlp_ratio)),
            nn.GELU(),
            nn.Linear(int(embed_dim * mlp_ratio), embed_dim),
        )
        self.drop_path_prob = drop_path

    def drop_path(self, x, residual):
        """Apply stochastic depth: randomly drop the residual branch."""
        if self.drop_path_prob == 0.0 or not self.training:
            return x + residual
        keep_prob = 1.0 - self.drop_path_prob
        # Bernoulli mask: shape (B, 1, 1)
        mask = torch.bernoulli(
            torch.full((x.shape[0], 1, 1), keep_prob, device=x.device)
        ) / keep_prob
        return x + residual * mask

    def forward(self, x):
        # Pre-norm attention
        normed = self.norm1(x)
        attn_out, _ = self.attn(normed, normed, normed)
        x = self.drop_path(x, attn_out)
        # Pre-norm MLP
        x = self.drop_path(x, self.mlp(self.norm2(x)))
        return x


class DeiT(nn.Module):
    """
    DeiT-S: 22M params, 384 embed_dim, 6 heads, 12 blocks.
    Adds a distillation token alongside the [CLS] token.

    At training: two heads, two losses.
    At inference: sum logits from both heads, take argmax.
    """
    def __init__(
        self,
        img_size=224,
        patch_size=16,
        num_classes=1000,
        embed_dim=384,
        depth=12,
        num_heads=6,
        mlp_ratio=4.0,
        drop_path_rate=0.1,
    ):
        super().__init__()
        self.patch_embed = PatchEmbedding(img_size, patch_size, embed_dim=embed_dim)
        num_patches = self.patch_embed.num_patches

        # Learnable [CLS] and distillation tokens
        self.cls_token  = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.dist_token = nn.Parameter(torch.zeros(1, 1, embed_dim))

        # Positional embeddings: num_patches + 2 (cls + dist)
        self.pos_embed = nn.Parameter(
            torch.zeros(1, num_patches + 2, embed_dim)
        )

        # Stochastic depth: linearly increasing drop-path rate
        dpr = [x.item() for x in torch.linspace(0, drop_path_rate, depth)]
        self.blocks = nn.ModuleList([
            DeiTBlock(embed_dim, num_heads, mlp_ratio, dpr[i])
            for i in range(depth)
        ])

        self.norm = nn.LayerNorm(embed_dim)

        # Two separate classification heads
        self.head      = nn.Linear(embed_dim, num_classes)  # supervised by ground truth
        self.head_dist = nn.Linear(embed_dim, num_classes)  # supervised by teacher

        # Weight initialization
        nn.init.trunc_normal_(self.cls_token,  std=0.02)
        nn.init.trunc_normal_(self.dist_token, std=0.02)
        nn.init.trunc_normal_(self.pos_embed,  std=0.02)

    def forward(self, x):
        B = x.shape[0]

        # Patch embeddings: (B, N, D)
        x = self.patch_embed(x)

        # Prepend [CLS] and distillation tokens: (B, N+2, D)
        cls_tokens  = self.cls_token.expand(B, -1, -1)
        dist_tokens = self.dist_token.expand(B, -1, -1)
        x = torch.cat([cls_tokens, dist_tokens, x], dim=1)

        # Add positional embeddings and pass through blocks
        x = x + self.pos_embed
        for block in self.blocks:
            x = block(x)
        x = self.norm(x)

        # Extract the two special tokens
        cls_out  = x[:, 0]   # [CLS] token
        dist_out = x[:, 1]   # distillation token

        # Two heads produce logits
        logits_cls  = self.head(cls_out)
        logits_dist = self.head_dist(dist_out)

        if self.training:
            return logits_cls, logits_dist
        else:
            # At inference, average the two predictions
            return (logits_cls + logits_dist) / 2


# ── Knowledge Distillation Loss ────────────────────────────────────────────────

class HardDistillationLoss(nn.Module):
    """
    DeiT's default: hard-label distillation.
    - cls_loss:  CrossEntropy(student_cls_logits, ground_truth)
    - dist_loss: CrossEntropy(student_dist_logits, teacher_argmax)
    """
    def __init__(self, lam=0.5):
        super().__init__()
        self.lam = lam

    def forward(self, logits_cls, logits_dist, y_true, teacher_logits):
        # Teacher's hard prediction
        y_teacher = teacher_logits.argmax(dim=-1)

        cls_loss  = F.cross_entropy(logits_cls,  y_true)
        dist_loss = F.cross_entropy(logits_dist, y_teacher)

        return (1 - self.lam) * cls_loss + self.lam * dist_loss


class SoftDistillationLoss(nn.Module):
    """
    Soft distillation using KL divergence at temperature T.
    Multiplies by T^2 to restore gradient scale.
    """
    def __init__(self, temperature=3.0, lam=0.5):
        super().__init__()
        self.T   = temperature
        self.lam = lam

    def forward(self, logits_cls, logits_dist, y_true, teacher_logits):
        cls_loss = F.cross_entropy(logits_cls, y_true)

        # Soft targets from teacher (temperature-scaled)
        p_teacher = F.softmax(teacher_logits / self.T, dim=-1)
        q_student = F.log_softmax(logits_dist  / self.T, dim=-1)

        # KL(P_teacher || Q_student), scaled by T^2
        kl_loss = F.kl_div(q_student, p_teacher, reduction="batchmean")
        dist_loss = self.T ** 2 * kl_loss

        return (1 - self.lam) * cls_loss + self.lam * dist_loss


# ── Minimal Training Loop ──────────────────────────────────────────────────────

def train_one_epoch(student, teacher, loader, criterion, optimizer, device):
    student.train()
    teacher.eval()
    total_loss = 0.0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        # Forward pass through frozen teacher CNN (e.g. RegNetY-16GF)
        with torch.no_grad():
            teacher_logits = teacher(images)

        # Forward pass through DeiT student
        logits_cls, logits_dist = student(images)

        # Combined distillation loss
        loss = criterion(logits_cls, logits_dist, labels, teacher_logits)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(loader)


# ── Usage Example ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # Student: DeiT-S
    student = DeiT(
        img_size=224, patch_size=16, num_classes=1000,
        embed_dim=384, depth=12, num_heads=6, drop_path_rate=0.1
    ).to(device)

    # Teacher: RegNetY-16GF (pre-trained CNN) — placeholder here
    teacher = torch.hub.load(
        "pytorch/vision", "regnet_y_16gf", pretrained=True
    ).to(device)

    # Loss and optimizer (DeiT-S hyperparameters)
    criterion = HardDistillationLoss(lam=0.5)
    optimizer = AdamW(student.parameters(), lr=1e-3, weight_decay=0.05)
    scheduler = CosineAnnealingLR(optimizer, T_max=300)

    params = sum(p.numel() for p in student.parameters())
    print(f"DeiT-S parameters: {params:,}")   # ~22M

    # Inference: combined heads
    student.eval()
    dummy = torch.randn(1, 3, 224, 224, device=device)
    logits = student(dummy)
    print(f"Inference output shape: {logits.shape}")   # (1, 1000)
`

// ── Python Content ────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of DeiT-S with a distillation token. Includes
                stochastic depth in each Transformer block, two separate classification
                heads, hard-label and soft-label distillation losses, and a minimal
                training loop that runs the CNN teacher in inference mode alongside the
                ViT student.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="deit.py"
                lang="python"
                langLabel="Python"
            />
            <div className="ch-callout">
                <strong>Implementation note:</strong> The distillation token occupies
                position 1 in the sequence (after [CLS] at position 0). Positional
                embeddings must therefore have shape (1, num&#8202;_&#8202;patches + 2, D)
                to cover both special tokens. At inference, the student averages
                logits from both heads before taking the argmax &mdash; do not apply
                softmax before averaging, as summing logits is equivalent to multiplying
                probabilities (geometric mean), which is more accurate than averaging
                softmax outputs (arithmetic mean).
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const DEIT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
