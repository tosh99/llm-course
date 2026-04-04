import { CodeBlock } from "../../shared"

// ── Introduction Topic: Code Tab ──────────────────────────────────────────────

export function CodeTab() {
    return (
        <>
            <h3>LeNet-5 Implementation</h3>
            <CodeBlock
                filename="lenet5.py"
                code={`import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet5(nn.Module):
    """
    LeNet-5 implementation following LeCun et al. 1998.

    Architecture:
    Input: 1x32x32 grayscale image
    C1: Conv(1→6, 5x5) → 6x28x28
    S2: AvgPool(2x2, stride 2) → 6x14x14
    C3: Conv(6→16, 5x5) → 16x10x10
    S4: AvgPool(2x2, stride 2) → 16x5x5
    C5: Conv(16→120, 5x5) → 120x1x1
    F6: FC(120→84) → 84
    Output: FC(84→10) → 10
    """

    def __init__(self, num_classes=10):
        super(LeNet5, self).__init__()

        # Feature extraction layers
        self.C1 = nn.Conv2d(1, 6, kernel_size=5, stride=1, padding=0)
        self.S2 = nn.AvgPool2d(kernel_size=2, stride=2)
        self.C3 = nn.Conv2d(6, 16, kernel_size=5, stride=1, padding=0)
        self.S4 = nn.AvgPool2d(kernel_size=2, stride=2)

        # Fully-connected classifier
        self.C5 = nn.Conv2d(16, 120, kernel_size=5, stride=1, padding=0)
        self.F6 = nn.Linear(120, 84)
        self.output = nn.Linear(84, num_classes)

    def forward(self, x):
        # C1 + activation (tanh historically, ReLU modern)
        x = F.tanh(self.C1(x))
        x = self.S2(x)

        # C3 + activation
        x = F.tanh(self.C3(x))
        x = self.S4(x)

        # C5 + flatten
        x = F.tanh(self.C5(x))
        x = x.view(x.size(0), -1)

        # F6
        x = F.tanh(self.F6(x))

        # Output
        x = self.output(x)
        return x


# Modern variant with improvements
class ModernLeNet5(nn.Module):
    """LeNet-5 with modern training techniques."""

    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 6, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(6, 16, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 120, 5),
            nn.ReLU(),
        )
        self.classifier = nn.Sequential(
            nn.Linear(120, 84),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(84, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x


if __name__ == "__main__":
    model = LeNet5(num_classes=10)
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Total parameters: {total_params:,}")
    # Output: ~60,840 parameters

    x = torch.randn(1, 1, 32, 32)
    logits = model(x)
    print(f"Output shape: {logits.shape}")`}
            />

            <h3>Training Configuration</h3>
            <CodeBlock
                filename="train.py"
                code={`import torch.optim as optim
from torchvision import datasets, transforms

# Data augmentation and normalization
transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

# Load MNIST
train_loader = torch.utils.data.DataLoader(
    datasets.MNIST('./data', train=True, download=True, transform=transform),
    batch_size=64, shuffle=True
)

test_loader = torch.utils.data.DataLoader(
    datasets.MNIST('./data', train=False, transform=transform),
    batch_size=1000
)

# Model, loss, optimizer
model = LeNet5()
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)

# Training loop
for epoch in range(20):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        if batch_idx % 100 == 0:
            print(f'Epoch: {epoch} [{batch_idx * len(data)}/{len(train_loader.dataset)}] Loss: {loss.item():.4f}')

    scheduler.step()

    # Evaluation
    model.eval()
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            output = model(data)
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()

    accuracy = 100. * correct / len(test_loader.dataset)
    print(f'Epoch {epoch}: Test Accuracy: {accuracy:.2f}%')
    # Expected: ~99% on MNIST`}
            />
        </>
    )
}
