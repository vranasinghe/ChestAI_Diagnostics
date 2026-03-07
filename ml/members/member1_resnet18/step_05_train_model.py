import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path
from tqdm import tqdm

from step_03_dataset_loader import get_dataloaders
from step_04_model import get_resnet18_model

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

MODEL_DIR = BASE_PATH / "ml" / "models" / "member1_resnet18"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

BEST_MODEL_PATH = MODEL_DIR / "best_model.pth"

#Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", device)

#Loading data
train_loader, val_loader, _ = get_dataloaders(batch_size=32)

#Model
model = get_resnet18_model()

model = model.to(device)

#Loss and optimizing
criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(model.parameters(), lr=0.0001)

#Training settings
EPOCHS = 25

best_val_accuracy = 0

#Traininf loop
for epoch in range(EPOCHS):

    print(f"\nEpoch {epoch+1}/{EPOCHS}")

#Training
    model.train()

    train_loss = 0
    correct = 0
    total = 0

    for images, labels in tqdm(train_loader):

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        train_loss += loss.item()

        _, predicted = torch.max(outputs.data, 1)

        total += labels.size(0)

        correct += (predicted == labels).sum().item()

    train_accuracy = 100 * correct / total

    print(f"Train Loss: {train_loss:.4f}")
    print(f"Train Accuracy: {train_accuracy:.2f}%")


#Validating step
    model.eval()

    val_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_loss += loss.item()

            _, predicted = torch.max(outputs.data, 1)

            total += labels.size(0)

            correct += (predicted == labels).sum().item()

    val_accuracy = 100 * correct / total

    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_accuracy:.2f}%")


#Saving the best model
    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        torch.save(model.state_dict(), BEST_MODEL_PATH)

        print("Best model saved")

print("\nTraining complete")

print("Best validation accuracy:", best_val_accuracy)
print("Model saved to:", BEST_MODEL_PATH)