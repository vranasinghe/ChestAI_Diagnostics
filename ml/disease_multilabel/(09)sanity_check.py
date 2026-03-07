import pandas as pd
import os

# CSV file
csv_path = r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system\data\processed\multi\(04)CNN_ready_multiclass.csv"

# Base directory where image folders exist
base_dir = r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system\data\raw"

# Create list of image directories (images_001 → images_012)
image_dirs = [
    os.path.join(base_dir, f"images_{str(i).zfill(3)}", "images")
    for i in range(1, 13)
]

# Load CSV
df = pd.read_csv(csv_path)

missing_images = []
existing_images = []

for img in df["Image Index"]:

    found = False

    for folder in image_dirs:
        img_path = os.path.join(folder, img)

        if os.path.exists(img_path):
            existing_images.append(img)
            found = True
            break

    if not found:
        missing_images.append(img)

print("Total records in CSV:", len(df))
print("Existing images:", len(existing_images))
print("Missing images:", len(missing_images))

# Save missing list
if len(missing_images) > 0:
    pd.DataFrame(missing_images, columns=["Missing Images"]).to_csv(
        "missing_images.csv", index=False
    )
    print("Missing images saved to missing_images.csv")
else:
    print("All images exist. Dataset is clean.")