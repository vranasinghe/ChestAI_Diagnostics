from pathlib import Path

FOLDER_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system\data\raw\images_001")

if not FOLDER_PATH.exists():
    print("Folder does not exist.")
    exit()

image_files = list(FOLDER_PATH.glob("*"))

print(f"Total files in images_001: {len(image_files)}\n")

for img in sorted(image_files):
    print(img.name)


