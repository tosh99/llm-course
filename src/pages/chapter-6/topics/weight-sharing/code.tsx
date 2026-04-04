import { CodeBlock } from "../../shared"

// ── Weight Sharing Topic: Code Tab ────────────────────────────────────────────

export function CodeTab() {
    return (
        <>
            <h3>Convolution from Scratch</h3>
            <CodeBlock
                filename="convolution_manual.py"
                code={`import numpy as np
import torch.nn.functional as F

def manual_conv2d(input, kernel, bias=0, stride=1, padding=0):
    """
    Manual implementation of 2D convolution to understand the mechanics.
    """
    # Add padding if specified
    if padding > 0:
        input = np.pad(input, pad_width=padding, mode='constant')

    # Handle dimensions
    if input.ndim == 2:
        input = input[np.newaxis, np.newaxis, :, :]
    if kernel.ndim == 2:
        kernel = kernel[np.newaxis, np.newaxis, :, :]

    batch, in_c, h, w = input.shape
    out_c, in_c_k, k_h, k_w = kernel.shape
    assert in_c == in_c_k, "Input channels must match"

    # Calculate output dimensions
    out_h = (h - k_h) // stride + 1
    out_w = (w - k_w) // stride + 1

    # Initialize output
    output = np.zeros((batch, out_c, out_h, out_w))

    # Perform convolution (sliding dot product)
    for b in range(batch):
        for oc in range(out_c):
            for i in range(out_h):
                for j in range(out_w):
                    i_start = i * stride
                    i_end = i_start + k_h
                    j_start = j * stride
                    j_end = j_start + k_w

                    receptive_field = input[b, :, i_start:i_end, j_start:j_end]

                    for ic in range(in_c):
                        output[b, oc, i, j] += np.sum(
                            receptive_field[ic] * kernel[oc, ic]
                        )

                    output[b, oc, i, j] += bias[oc] if isinstance(bias, np.ndarray) else bias

    return output.squeeze()


# Demonstration
if __name__ == "__main__":
    input_image = np.random.randn(1, 1, 8, 8)

    # Vertical edge detector
    kernel_v = np.array([[[[-1, 0, 1],
                           [-2, 0, 2],
                           [-1, 0, 1]]]])

    manual_result = manual_conv2d(input_image, kernel_v)
    print(f"Manual conv output shape: {manual_result.shape}")

    # Verify with PyTorch
    import torch
    torch_result = F.conv2d(
        torch.tensor(input_image).float(),
        torch.tensor(kernel_v).float()
    )

    diff = np.abs(manual_result - torch_result.numpy()).max()
    print(f"Max difference from PyTorch: {diff:.10f}")`}
            />

            <h3>Visualizing Receptive Fields</h3>
            <CodeBlock
                filename="receptive_field.py"
                code={`import torch
import torch.nn as nn

def compute_receptive_field(layers):
    """
    Calculate the effective receptive field size.
    Formula: R_l = R_{l-1} + (k_l - 1) * j_{l-1}
    """
    r = 1  # Initial receptive field
    j = 1  # Initial jump (stride)

    info = []
    for layer in layers:
        if isinstance(layer, nn.Conv2d):
            k = layer.kernel_size[0]
            s = layer.stride[0]
            r = r + (k - 1) * j
            j = j * s
            info.append(f"Conv[{k}x{k}, s={s}]: RF={r}, jump={j}")
        elif isinstance(layer, (nn.MaxPool2d, nn.AvgPool2d)):
            k = layer.kernel_size
            s = layer.stride
            r = r + (k - 1) * j
            j = j * s
            info.append(f"Pool[{k}x{k}, s={s}]: RF={r}, jump={j}")

    return r, j, info


# LeNet-5 receptive field analysis
layers = [
    nn.Conv2d(1, 6, 5),
    nn.MaxPool2d(2, 2),
    nn.Conv2d(6, 16, 5),
    nn.MaxPool2d(2, 2),
    nn.Conv2d(16, 120, 5),
]

rf, jump, info = compute_receptive_field(layers)
print("LeNet-5 Receptive Field Analysis:")
for line in info:
    print(f"  {line}")
print(f"\\nFinal receptive field: {rf}x{rf}")`}
            />
        </>
    )
}
