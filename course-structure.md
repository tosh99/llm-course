# Machine Learning to Large Language Models — Course Structure

A progressive curriculum tracing the historical development of ML, deep learning, and modern LLMs.

---

## Prerequisites

### Chapter 0 — Mathematics & Programming Foundations
- **Linear Algebra**: vectors, matrices, dot products, eigenvalues, SVD
- **Calculus**: derivatives, partial derivatives, chain rule, gradients
- **Probability & Statistics**: distributions, Bayes' theorem, MLE, expectation
- **Information Theory**: entropy, KL divergence, cross-entropy
- **Python**: NumPy, Pandas, Matplotlib
- **Computing**: CPU vs GPU, vectorized operations, memory layout

---

## Part I — Classical Machine Learning (1950s–2000s)

### Chapter 1 — The Perceptron & Early Neural Concepts *(1943–1969)*
- McCulloch & Pitts neuron model (1943)
- Hebb's learning rule (1949)
- Rosenblatt's Perceptron (1958) — first trainable model
- Perceptron convergence theorem
- Minsky & Papert's *Perceptrons* (1969) — XOR problem, first AI winter

### Chapter 2 — Classical ML Algorithms *(1960s–1990s)*
- Linear & Logistic Regression
- Decision Trees (CART, 1984)
- k-Nearest Neighbors
- Naive Bayes classifiers
- Support Vector Machines — Vapnik (1963, kernel SVM 1992)
- Ensemble methods: Bagging, Random Forests (Breiman, 2001), Boosting (AdaBoost 1997)
- Bias-variance tradeoff, overfitting, regularization (L1/L2)

### Chapter 3 — Unsupervised Learning *(1960s–2000s)*
- k-Means clustering (MacQueen, 1967)
- Hierarchical clustering
- PCA — dimensionality reduction (Pearson, 1901; popularized 1980s)
- Gaussian Mixture Models & EM algorithm (Dempster et al., 1977)
- Autoencoders — early form (Rumelhart, 1986)

---

## Part II — The Backpropagation Era & Neural Network Revival (1986–2005)

### Chapter 4 — Backpropagation & MLPs *(1986)*
- Rumelhart, Hinton & Williams — backpropagation paper (1986)
- Multi-layer Perceptrons (MLPs)
- Activation functions: sigmoid, tanh
- Gradient descent: batch, stochastic, mini-batch
- Vanishing/exploding gradients problem
- Universal approximation theorem (Cybenko, 1989; Hornik, 1991)

### Chapter 5 — Recurrent Neural Networks *(1986–1997)*
- Simple RNNs — Elman & Jordan networks (1990)
- Backpropagation Through Time (BPTT)
- Vanishing gradient in sequences
- **LSTM** — Hochreiter & Schmidhuber (1997)
- GRU — Cho et al. (2014, covered later in context)
- Applications: language modeling, time series

### Chapter 6 — Convolutional Neural Networks *(1989–1998)*
- Weight sharing and local receptive fields
- LeNet-5 — LeCun et al. (1998): digit recognition, convolution + pooling
- CNN building blocks: Conv, Pool, Flatten, FC
- Feature hierarchies and spatial invariance
- Why CNNs stalled through the 2000s (compute & data limits)

---

## Part III — The Deep Learning Revolution (2006–2014)

### Chapter 7 — Deep Learning Reignition *(2006–2012)*
- Hinton's Deep Belief Networks & pretraining (2006)
- Restricted Boltzmann Machines (RBMs)
- Rectified Linear Units (ReLU) — Nair & Hinton (2010)
- Dropout regularization — Srivastava et al. (2014)
- Xavier/He initialization
- **AlexNet** — Krizhevsky, Sutskever, Hinton (2012): ImageNet breakthrough, GPUs go mainstream

### Chapter 8 — CNN Architectures *(2012–2016)*
- AlexNet (2012) — deep CNN, GPU training, ReLU, dropout
- VGGNet (2014) — depth with small filters
- GoogLeNet/Inception (2014) — inception modules
- ResNet (2015) — residual connections, 152 layers, skip connections
- DenseNet (2017)
- Lessons: depth, skip connections, normalization

### Chapter 9 — Optimization & Training Techniques *(2012–2018)*
- Momentum, RMSProp
- **Adam optimizer** — Kingma & Ba (2014)
- Batch Normalization — Ioffe & Szegedy (2015)
- Layer Normalization — Ba et al. (2016)
- Learning rate schedules: warmup, cosine annealing
- Weight decay, gradient clipping

### Chapter 10 — Word Representations *(2013–2015)*
- One-hot encoding and its limits
- **Word2Vec** — Mikolov et al. (2013): Skip-gram, CBOW, negative sampling
- GloVe — Pennington et al. (2014): global co-occurrence statistics
- FastText — Bojanowski et al. (2017)
- Properties of word embeddings: analogies, semantic space
- Limitations: static embeddings, no context

---

## Part IV — Sequence Modeling & Attention (2014–2017)

### Chapter 11 — Encoder-Decoder & Seq2Seq *(2014)*
- Sequence-to-sequence learning — Sutskever, Vinyals, Le (2014)
- Encoder-decoder architecture with LSTMs
- Machine translation as the motivating task
- Teacher forcing
- Bottleneck problem in fixed-size context vectors

### Chapter 12 — Attention Mechanism *(2015)*
- **Bahdanau Attention** (additive attention) — Bahdanau, Cho, Bengio (2015)
- Alignment scores and context vectors
- Luong Attention (multiplicative) — Luong et al. (2015)
- Soft vs hard attention
- How attention solved the bottleneck problem

### Chapter 13 — Gated Units & Advanced RNNs *(2014–2017)*
- GRU — Cho et al. (2014): simpler LSTM alternative
- Bidirectional RNNs
- Deep stacked RNNs
- RNN language models
- Limitations of sequential computation: no parallelism

---

## Part V — The Transformer & Pre-training Era (2017–2020)

### Chapter 14 — The Transformer *(2017)*
- **"Attention Is All You Need"** — Vaswani et al. (2017)
- Scaled dot-product attention: Query, Key, Value
- Multi-head attention
- Positional encoding
- Feed-forward sublayers
- Encoder and decoder stacks
- Why Transformers replaced RNNs: parallelism, long-range dependencies

### Chapter 15 — Transfer Learning & Pre-training *(2018)*
- ULMFiT — Howard & Ruder (2018): fine-tuning LMs for NLP
- **ELMo** — Peters et al. (2018): contextual embeddings from bidirectional LSTMs
- **GPT-1** — Radford et al., OpenAI (2018): generative pre-training, decoder-only Transformer
- Pre-train on large corpus → fine-tune on downstream tasks
- The shift from task-specific to general pre-trained models

### Chapter 16 — BERT & Masked Language Modeling *(2018–2019)*
- **BERT** — Devlin et al., Google (2018): bidirectional encoder representations
- Masked Language Model (MLM) pre-training objective
- Next Sentence Prediction (NSP)
- Fine-tuning BERT for classification, NER, QA
- BERT variants: RoBERTa (2019), ALBERT (2019), DistilBERT (2019)
- Encoder-only vs decoder-only tradeoffs

### Chapter 17 — Scaling Up: GPT-2 & T5 *(2019)*
- **GPT-2** — Radford et al., OpenAI (2019): 1.5B parameters, zero-shot abilities, "too dangerous to release"
- **T5** — Raffel et al., Google (2019): text-to-text unified framework, encoder-decoder
- Scaling laws — first observations on compute vs performance
- Dataset curation: C4, WebText

---

## Part VI — Large Language Models (2020–present)

### Chapter 18 — The Scaling Hypothesis *(2020)*
- **Scaling Laws for Neural Language Models** — Kaplan et al., OpenAI (2020)
- Power laws: parameters, data, compute
- Emergent abilities with scale
- Chinchilla scaling laws — Hoffmann et al., DeepMind (2022): optimal token-to-parameter ratio

### Chapter 19 — GPT-3 & Few-Shot Learning *(2020)*
- **GPT-3** — Brown et al., OpenAI (2020): 175B parameters
- In-context learning: zero-shot, one-shot, few-shot prompting
- No gradient updates at inference
- Prompt engineering as a new paradigm
- Limitations: factual errors, no grounding, static knowledge

### Chapter 20 — Instruction Tuning & RLHF *(2021–2022)*
- **InstructGPT / RLHF** — Ouyang et al., OpenAI (2022)
- Supervised Fine-Tuning (SFT) on demonstrations
- Reward model training from human preferences
- Proximal Policy Optimization (PPO) for alignment
- **ChatGPT** (2022): RLHF-tuned GPT, conversational interface
- Constitutional AI — Anthropic (2022): AI feedback instead of human labels

### Chapter 21 — Open LLMs & Efficiency *(2022–2023)*
- **LLaMA** — Touvron et al., Meta (2023): open weights, efficient training
- LLaMA 2 (2023), LLaMA 3 (2024)
- Mistral 7B (2023): sliding window attention, grouped query attention
- **LoRA** — Hu et al. (2022): low-rank adaptation, efficient fine-tuning
- QLoRA — Dettmers et al. (2023): 4-bit quantization + LoRA
- Alpaca, Vicuna: instruction-tuning open models cheaply

### Chapter 22 — Transformer Architecture Advances *(2020–2024)*
- Sparse attention: Longformer (2020), BigBird (2020)
- Flash Attention — Dao et al. (2022): IO-aware exact attention
- Grouped Query Attention (GQA) and Multi-Query Attention (MQA)
- Rotary Positional Embeddings (RoPE) — Su et al. (2021)
- ALiBi positional bias (2022)
- Mixture of Experts (MoE) — Mixtral (2024), GPT-4 (rumored)
- KV cache and inference optimization

### Chapter 23 — Multimodal Models *(2021–2024)*
- CLIP — Radford et al., OpenAI (2021): contrastive image-text pretraining
- DALL-E (2021), DALL-E 2 (2022), Stable Diffusion (2022)
- Flamingo — DeepMind (2022): vision-language few-shot model
- **GPT-4V** (2023): vision input to LLM
- LLaVA (2023): open visual instruction tuning
- Gemini — Google (2023): natively multimodal from pretraining

### Chapter 24 — Retrieval-Augmented Generation *(2020–2024)*
- RAG — Lewis et al., Facebook AI (2020)
- Dense passage retrieval (DPR)
- Vector databases: FAISS, Pinecone, Chroma
- RAG pipeline: chunking, embedding, retrieval, generation
- Re-ranking and hybrid search
- Reducing hallucination with grounding

### Chapter 25 — Agents & Tool Use *(2022–2024)*
- ReAct — Yao et al. (2022): reasoning + acting with LLMs
- Toolformer — Schick et al. (2023): self-supervised tool use
- Function calling in GPT-4 (2023)
- LLM agents: planning, memory, tool integration
- Multi-agent frameworks: AutoGPT, CrewAI, LangGraph

---

## Part VII — Frontiers (2024–present)

### Chapter 26 — Long Context & Memory
- 128K+ context windows (GPT-4 Turbo, Gemini 1.5 Pro: 1M tokens)
- Positional interpolation for extending context
- Needle-in-a-haystack evaluations
- External memory vs in-context vs parametric knowledge

### Chapter 27 — Reasoning & Chain-of-Thought
- Chain-of-Thought prompting — Wei et al. (2022)
- Self-consistency sampling
- Tree of Thoughts (2023)
- **OpenAI o1 / o3** (2024): reinforcement learning for reasoning traces
- Process Reward Models (PRMs) vs Outcome Reward Models
- DeepSeek-R1 (2025): open reasoning model

### Chapter 28 — Alignment, Safety & Evaluation
- Alignment problem overview
- Red-teaming and adversarial prompting
- Hallucination: causes, detection, mitigation
- MMLU, HumanEval, BIG-Bench, HELM — benchmarks
- LLM-as-judge evaluation
- Responsible AI: bias, fairness, misuse

---

## Appendix

### A — Practical Tools & Ecosystem
- PyTorch fundamentals (autograd, nn.Module, DataLoader)
- HuggingFace Transformers & Datasets
- Weights & Biases for experiment tracking
- vLLM / llama.cpp for inference
- LangChain / LlamaIndex for LLM applications

### B — Key Papers Reading List
> Organized by chapter with direct citations for self-study.

### C — Compute & Infrastructure
- GPU memory math: parameters, activations, optimizer states
- Mixed precision training (FP16, BF16)
- Distributed training: data parallel, tensor parallel, pipeline parallel
- FSDP, DeepSpeed ZeRO

---

*Timeline spans: Classical ML (1950–2000) → Deep Learning (2006–2016) → Transformers (2017–2019) → LLMs (2020–present)*
