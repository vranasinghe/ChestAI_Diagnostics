import pandas as pd
import os
from pathlib import Path
from PIL import Image
import shutil

# Missing image names
missing_csv = r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system\ml\disease_multilabel\missing_images.csv"

# External dataset
external_dir = r"E:\Medicine\chest_xray\train\PNEUMONIA"

# NIH dataset base
base_dir = r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system\data\raw"

missing_df = pd.read_csv(missing_csv)

missing_names = missing_df["Missing Images"].tolist()

print("Missing images required:", len(missing_names))

#Getting images from the externel datastet

external_images = list(Path(external_dir).glob("*"))

print("External images available:", len(external_images))

# Limit to needed amount
external_images = external_images[:len(missing_names)]

print("External images used:", len(external_images))

#Creating Destination folders

image_folders = [
    os.path.join(base_dir, f"images_{str(i).zfill(3)}", "images")
    for i in range(1, 13)
]

#Importing images

folder_index = 0
imported = 0

for src_img, target_name in zip(external_images, missing_names):

    dest_folder = image_folders[folder_index]

    dest_path = os.path.join(dest_folder, target_name)

    try:

        # Convert to PNG and rename
        img = Image.open(src_img).convert("RGB")
        img.save(dest_path)

        imported += 1

    except Exception as e:
        print("Error processing:", src_img)
        print(e)

    # Move to next folder (round robin distribution)
    folder_index = (folder_index + 1) % len(image_folders)

#Results

print("\nImport complete")

print("Images imported:", imported)

print("Folders used:", len(image_folders))

print("Distribution: ~", imported // len(image_folders), "per folder")