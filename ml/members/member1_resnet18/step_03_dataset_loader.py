import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import pandas as pd
from pathlib import Path
import os
import json


BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

DATA_DIR = BASE_PATH / "ml" / "members" / "member1_resnet18" / "processed"

TRAIN_CSV = DATA_DIR / "train.csv"
VAL_CSV = DATA_DIR / "val.csv"
TEST_CSV = DATA_DIR / "test.csv"

RAW_IMAGES_BASE = BASE_PATH / "data" / "raw"

OUTPUT_LABEL_MAP = BASE_PATH / "ml" / "members" / "member1_resnet18" / "label_map.json"

#Loading label map
with open(OUTPUT_LABEL_MAP, "r") as f:
    label_map = json.load(f)


#Transforming
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.ToTensor(),
])

val_test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

#Creating the custom dataset

class XRayDataset(Dataset):
    def __init__(self, csv_file, image_base, transform=None):
        self.df = pd.read_csv(csv_file)
        self.image_base = image_base
        self.transform = transform

        # Collect folder list (images_001 ... images_012)
        self.folders = [f"images_{str(i).zfill(3)}" for i in range(1, 13)]

        # Map image index to full path
        self.image_paths = []
        for idx, row in self.df.iterrows():
            img_name = row["Image Index"]
            found = False
            for folder in self.folders:
                img_path = image_base / folder / "images" / img_name
                if img_path.exists():
                    self.image_paths.append((img_path, row["label"]))
                    found = True
                    break
            if not found:
                raise FileNotFoundError(f"Image not found: {img_name}")

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path, label = self.image_paths[idx]

        try:
            image = Image.open(img_path).convert("RGB")
        except Exception as e:
            print(f"Skipping corrupted image: {img_path}")
            return self.__getitem__((idx + 1) % len(self.image_paths))

        if self.transform:
            image = self.transform(image)

        return image, torch.tensor(label, dtype=torch.long)

#Loading the data

def get_dataloaders(batch_size=32, num_workers=4):
    train_dataset = XRayDataset(TRAIN_CSV, RAW_IMAGES_BASE, transform=train_transform)
    val_dataset   = XRayDataset(VAL_CSV, RAW_IMAGES_BASE, transform=val_test_transforms)
    test_dataset  = XRayDataset(TEST_CSV, RAW_IMAGES_BASE, transform=val_test_transforms)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader   = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    test_loader  = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    print(f"Train samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    print(f"Test samples: {len(test_dataset)}")

    return train_loader, val_loader, test_loader