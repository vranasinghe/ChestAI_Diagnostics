import torch
from torchvision.models import densenet121
import torch.nn as nn

def main():
    path = r'c:\Users\LENOVO\OneDrive\Documents\XRAY-ML-classification-system\backend\app\weights\Binary_Model.pth'
    data = torch.load(path, map_location='cpu')
    if 'state_dict' in data:
        data = data['state_dict']

    model = densenet121(weights=None)
    num_ftrs = model.classifier.in_features
    # Try different output sizes just in case
    for out_features in [1, 2]:
        model.classifier = nn.Linear(num_ftrs, out_features)
        
        missing, unexpected = model.load_state_dict(data, strict=False)
        print(f"DenseNet121 outputs={out_features} tests:")
        print("Missing:", len(missing))
        print("Unexpected:", len(unexpected))
        if len(missing) == 0 and len(unexpected) == 0:
             print("SUCCESS!")
             break
        if out_features == 2:
             print("Missing:", missing[:10])
             print("Unexpected:", unexpected[:10])
             
if __name__ == '__main__':
    main()
