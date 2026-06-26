import torch
import sys

def main():
    path = r'c:\Users\LENOVO\OneDrive\Documents\XRAY-ML-classification-system\backend\app\weights\MultiClass_Ensemple_Model.pt'
    try:
        data = torch.load(path, map_location='cpu')
        print("Successfully loaded via torch.load!")
        print("Type:", type(data))
        if isinstance(data, dict):
            print("Keys:", list(data.keys())[:10])
            for k in list(data.keys())[:3]:
                 print(f"  {k}: {type(data[k])}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
