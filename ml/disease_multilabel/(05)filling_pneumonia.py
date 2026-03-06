import pandas as pd
import shutil
from pathlib import Path
from PIL import Image

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(02)expanded_single_labels.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(02b)expanded_single_labels_with_external_pneumonia.csv"

IMAGES_BASE = BASE_PATH / "data" / "raw"

# External dataset
EXTERNAL_PNEUMONIA = Path(r"E:\Medicine\chest_xray\train\PNEUMONIA")

PNEUMONIA_IMAGES_NEEDED = 869

print("Loading dataset...")

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

#Removing Fibrosis
df = df[df["Finding Labels"] != "Fibrosis"]

print("Fibrosis removed")

print("Finding max patient ID...")

patient_ids = df["Image Index"].str.split("_").str[0].astype(int)

max_id = patient_ids.max()

print("Current max patient id:", max_id)

#Getting external images

external_images = list(EXTERNAL_PNEUMONIA.glob("*"))

print("External images found:", len(external_images))

external_images = external_images[:PNEUMONIA_IMAGES_NEEDED]

print("Importing:", len(external_images))


#Distributing into 12 folders

folders = [f"images_{str(i).zfill(3)}" for i in range(1, 13)]

folder_index = 0

new_rows = []

# Importing
for img_path in external_images:

    max_id += 1

    patient_id = str(max_id).zfill(5)

    new_filename = f"000{patient_id}_000.png"

    folder = folders[folder_index]

    dest_folder = IMAGES_BASE / folder / "images"

    dest_path = dest_folder / new_filename

    # convert image to PNG
    img = Image.open(img_path).convert("RGB")
    img.save(dest_path)

    # rotate folder
    folder_index = (folder_index + 1) % 12

    # create CSV row
    new_row = {
        "Image Index": new_filename,
        "Finding Labels": "Pneumonia"
    }

    new_rows.append(new_row)


df_external = pd.DataFrame(new_rows)

df_final = pd.concat([df, df_external], ignore_index=True)

#Saving

df_final.to_csv(OUTPUT_CSV, index=False)

print("\nExternal pneumonia images imported successfully")

print("New dataset size:", len(df_final))

print("Saved CSV:")
print(OUTPUT_CSV)