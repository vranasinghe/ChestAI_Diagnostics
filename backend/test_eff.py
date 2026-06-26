import torch
import torch.nn as nn
from torchvision.models import efficientnet_v2_s

def main():
    path = r'c:\Users\LENOVO\OneDrive\Documents\XRAY-ML-classification-system\backend\app\weights\MultiClass_Ensemple_Model.pt'
    data = torch.load(path, map_location='cpu')
    if 'state_dict' in data:
        data = data['state_dict']

    model = efficientnet_v2_s(weights=None)
    model.classifier = nn.Sequential(
        nn.BatchNorm1d(1280),
        nn.Dropout(p=0.2), # usually dropout
        nn.Linear(1280, 512),
        nn.ReLU(),
        nn.BatchNorm1d(512),
        nn.Dropout(p=0.2),
        nn.Linear(512, 6)
    )

    missing, unexpected = model.load_state_dict(data, strict=False)
    print("efficientnet_v2_s tests:")
    print("Missing:", missing)
    print("Unexpected:", unexpected)
    if len(missing) == 0 and len(unexpected) == 0:
         print("SUCCESS!")

if __name__ == '__main__':
    main()
