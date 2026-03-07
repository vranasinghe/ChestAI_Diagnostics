import torch
import torch.nn as nn
from torchvision import models
import json
from pathlib import Path

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

OUTPUT_LABEL_MAP = BASE_PATH / "ml" / "members" / "member1_resnet18" / "label_map.json"

#Loading the number of classes

with open(OUTPUT_LABEL_MAP, "r") as f:
    label_map = json.load(f)

NUM_CLASSES = len(label_map)

print("Number of classes:", NUM_CLASSES)

#Creating the model function

def get_resnet18_model(pretrained=True, freeze_backbone=False):

    # Load pretrained ResNet18
    model = models.resnet18(pretrained=pretrained)

    if freeze_backbone:
        for param in model.parameters():
            param.requires_grad = False

    #Replacing the final layer

    in_features = model.fc.in_features

    model.fc = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(256, NUM_CLASSES)
    )

    return model


#Testing

if __name__ == "__main__":

    model = get_resnet18_model()

    print("\nResNet18 Model Summary:\n")
    print(model)

    # Test forward pass
    dummy_input = torch.randn(1, 3, 224, 224)
    output = model(dummy_input)

    print("\nOutput shape:", output.shape)