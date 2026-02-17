import pandas as pd
import os
from pathlib import Path

# Automatically Detect Project Root
BASE_PATH = Path(__file__).resolve().parents[2]

DATA_CSV = BASE_PATH / "data" / "raw" / "Data_Entry_2017.csv"
IMAGES_ROOT = BASE_PATH / "data" / "raw"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(01)Data_preprocessing_Feature_Removal.csv"

REMOVE_DISEASES = ["Hernia", "Fibrosis"]

# Load Dataset
print("Loading dataset...")
df = pd.read_csv(DATA_CSV)

print(f"Original dataset size: {len(df)}")

# Identify Rows to Remove
def contains_removed_disease(label_string):
    diseases = label_string.split("|")
    return any(disease in REMOVE_DISEASES for disease in diseases)

rows_to_remove = df[df["Finding Labels"].apply(contains_removed_disease)]
rows_to_keep = df[~df["Finding Labels"].apply(contains_removed_disease)]

print(f"Records to remove: {len(rows_to_remove)}")
print(f"Remaining records: {len(rows_to_keep)}")

# Save Cleaned CSV
OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
rows_to_keep.to_csv(OUTPUT_CSV, index=False)

print(f"Cleaned CSV saved to:\n{OUTPUT_CSV}")

# Remove Corresponding Images
removed_count = 0

image_folders = list(IMAGES_ROOT.glob("images_*"))

if not image_folders:
    print("No image folders found under data/raw/")
else:
    for image_name in rows_to_remove["Image Index"]:
        for folder in image_folders:
            image_path = folder / "images" / image_name

            if image_path.exists():
                os.remove(image_path)
                removed_count += 1

print(f"Total images removed: {removed_count}")

print("\nDataset cleaning completed successfully.")
