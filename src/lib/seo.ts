export interface SeoMeta {
    title: string
    description: string
}

export const SITE_URL = "https://deeplearn.app"

export const SEO: Record<string, SeoMeta> = {
    "/": {
        title: "DeepLearn — ML → LLM Course",
        description:
            "A self-study curriculum tracing the historical development of machine learning, deep learning, and modern large language models — from the 1943 perceptron to today's reasoning models.",
    },
    "/chapter/0": {
        title: "Prerequisites & Foundations — DeepLearn",
        description:
            "Linear algebra, calculus, probability, information theory, and Python — the mathematical foundations needed to understand deep learning.",
    },
    "/chapter/1": {
        title: "The Perceptron & Early Neural Concepts — DeepLearn",
        description:
            "McCulloch-Pitts neurons, Hebb's rule, the Rosenblatt perceptron, and the XOR problem — the origins of neural computation from 1943–1969.",
    },
    "/chapter/2": {
        title: "Classical ML Algorithms — DeepLearn",
        description:
            "Linear regression, decision trees, SVMs, ensemble methods, and regularization — the classical machine learning toolkit from the 1960s–1990s.",
    },
    "/chapter/3": {
        title: "Unsupervised Learning — DeepLearn",
        description:
            "k-Means, hierarchical clustering, PCA, Gaussian mixture models, and the EM algorithm — discovering structure in unlabeled data.",
    },
    "/chapter/4": {
        title: "Backpropagation & MLPs — DeepLearn",
        description:
            "The backpropagation algorithm, multi-layer perceptrons, activation functions, gradient descent, and the vanishing gradient problem.",
    },
    "/chapter/5": {
        title: "Recurrent Neural Networks — DeepLearn",
        description:
            "Elman and Jordan RNNs, backpropagation through time, vanishing gradients, and LSTM — modeling sequences from 1986–1997.",
    },
    "/chapter/6": {
        title: "Convolutional Neural Networks — DeepLearn",
        description:
            "Weight sharing, LeNet-5, convolution and pooling, and feature hierarchies — the foundations of visual recognition from 1989–1998.",
    },
    "/chapter/7": {
        title: "Deep Learning Reignition — DeepLearn",
        description:
            "Deep belief networks, RBMs, ReLU, and dropout — the breakthroughs that reignited deep learning from 2006–2012.",
    },
    "/chapter/8": {
        title: "CNN Architectures — DeepLearn",
        description:
            "AlexNet, VGGNet, GoogLeNet, ResNet, DenseNet, GANs, and ViT — the evolution of convolutional architectures from 2012–2016.",
    },
    "/chapter/9": {
        title: "Optimization & Training Techniques — DeepLearn",
        description:
            "Momentum, Adam, batch normalization, layer normalization, and learning rate schedules — the techniques that make deep networks trainable.",
    },
    "/chapter/10": {
        title: "Word Representations — DeepLearn",
        description:
            "Word2Vec, GloVe, FastText, embeddings, language modeling, and perplexity — how words became vectors from 2013–2017.",
    },
    "/chapter/11": {
        title: "Encoder-Decoder & Seq2Seq — DeepLearn",
        description:
            "Seq2Seq models, LSTM encoder-decoder, machine translation, teacher forcing, and evaluation metrics — the rise of sequence-to-sequence learning in 2014.",
    },
    "/chapter/12": {
        title: "Attention Mechanism — DeepLearn",
        description:
            "Bahdanau attention, alignment scores, Luong attention, and soft vs hard attention — the attention revolution of 2015.",
    },
    "/chapter/13": {
        title: "Gated Units & Advanced RNNs — DeepLearn",
        description:
            "GRU, bidirectional RNNs, deep RNNs, and sequential parallelism — refinements to recurrent architectures from 2014–2017.",
    },
    "/chapter/14": {
        title: "The Transformer — DeepLearn",
        description:
            "Scaled dot-product attention, multi-head attention, positional encoding, and the encoder-decoder architecture — the 2017 paper that changed everything.",
    },
    "/chapter/16": {
        title: "BERT & Masked Language Modeling — DeepLearn",
        description:
            "BERT, masked language modeling, next sentence prediction, RoBERTa, and the encoder-only paradigm — how bidirectional understanding emerged in 2018–2019.",
    },
    "/chapter/17": {
        title: "Scaling Up: GPT-2 & T5 — DeepLearn",
        description:
            "GPT-2, T5, scaling laws, zero-shot learning, and the text-to-text framework — when bigger models started to surprise in 2019.",
    },
    "/chapter/18": {
        title: "The Scaling Hypothesis — DeepLearn",
        description:
            "Kaplan scaling laws, power laws, emergent abilities, and Chinchilla — understanding why scale matters from 2020 onward.",
    },
    "/chapter/19": {
        title: "GPT-3 & Few-Shot Learning — DeepLearn",
        description:
            "GPT-3 (175B), in-context learning, zero/one/few-shot prompting, and prompt engineering — the dawn of large-scale language models in 2020.",
    },
    "/chapter/20": {
        title: "Instruction Tuning & RLHF — DeepLearn",
        description:
            "InstructGPT, supervised fine-tuning, reward modeling, PPO, and constitutional AI — aligning language models with human intent from 2021–2022.",
    },
    "/chapter/21": {
        title: "Open LLMs & Efficiency — DeepLearn",
        description:
            "LLaMA, Mistral 7B, LoRA, QLoRA, and quantization — making large language models open and efficient from 2022–2023.",
    },
}