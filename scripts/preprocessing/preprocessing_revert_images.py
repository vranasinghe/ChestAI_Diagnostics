import pandas as pd
from pathlib import Path
import os

# =========================
# Configuration
# =========================

BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "(04)Data_with_External_Pneumonia.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(05)Data_augmented.csv"

IMAGE_FOLDER = BASE_PATH / "data" / "raw" / "images_012" / "New folder"

# =========================
# Load CSV
# =========================

df = pd.read_csv(INPUT_CSV)

print(f"Dataset size: {len(df)}")

# =========================
# Get External Pneumonia Rows
# =========================

external_rows = df[
    (df["Finding Labels"] == "Pneumonia") &
    (df["Image Index"].str.contains("external_pneumonia_"))
].copy()

print(f"External pneumonia rows in CSV: {len(external_rows)}")

# =========================
# Get All Images in Folder
# =========================

all_images = sorted(list(IMAGE_FOLDER.glob("*")))

print(f"Images found in folder: {len(all_images)}")

if len(all_images) < len(external_rows):
    raise ValueError("Not enough images in folder to match CSV records.")

# =========================
# Rename Images Sequentially
# =========================

rename_count = 0

for img_path, (_, row) in zip(all_images, external_rows.iterrows()):

    new_name = row["Image Index"]
    new_path = IMAGE_FOLDER / new_name

    # Rename file
    os.rename(img_path, new_path)

    rename_count += 1

print(f"Images renamed successfully: {rename_count}")

# =========================
# Save Updated CSV
# =========================

df.to_csv(OUTPUT_CSV, index=False)

print(f"Updated CSV saved to: {OUTPUT_CSV}")
print("Force sync completed successfully.")
