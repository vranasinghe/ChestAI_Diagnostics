import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from pathlib import Path
from tqdm import tqdm

from step_03_dataset_loader import get_dataloaders
from step_04_model import get_resnet18_model


def main():

    BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

    DATA_DIR = BASE_PATH / "ml" / "members" / "member1_resnet18" / "processed"
    TRAIN_CSV = DATA_DIR / "train.csv"

    MODEL_DIR = BASE_PATH / "ml" / "models" / "member1_resnet18"
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    BEST_MODEL_PATH = MODEL_DIR / "best_model.pth"

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    train_loader, val_loader, _ = get_dataloaders(
        batch_size=32,
        num_workers=0   # Windows safe
    )

    train_df = pd.read_csv(TRAIN_CSV)

    class_counts = train_df["label"].value_counts().sort_index()

    print("\nClass distribution:")
    print(class_counts)

    # Inverse frequency
    weights = 1.0 / class_counts

    # Normalize weights
    weights = weights / weights.sum()

    class_weights = torch.tensor(weights.values, dtype=torch.float).to(device)

    print("\nClass weights:", class_weights)

    model = get_resnet18_model()
    model = model.to(device)

    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = optim.Adam(model.parameters(), lr=0.00005, weight_decay=1e-4)

    EPOCHS = 20
    best_val_accuracy = 0

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

            train_loss += loss.item() * images.size(0)

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        train_loss = train_loss / total
        train_accuracy = 100 * correct / total

        print(f"Train Loss: {train_loss:.4f}")
        print(f"Train Accuracy: {train_accuracy:.2f}%")

#Validation
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

                val_loss += loss.item() * images.size(0)

                _, predicted = torch.max(outputs, 1)

                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        val_loss = val_loss / total
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


if __name__ == "__main__":
    main()