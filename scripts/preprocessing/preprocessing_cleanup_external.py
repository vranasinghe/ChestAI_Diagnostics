import pandas as pd
from pathlib import Path
import os
from PIL import Image

# Configuration
BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "(04)Data_with_External_Pneumonia.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(05)Data_augmented.csv"

IMAGE_FOLDER = BASE_PATH / "data" / "raw" / "images_012"

COLUMNS_TO_REMOVE = ["Unnamed: 11", "Follow-up #", "Dataset_Source"]

# Loading CSV
df = pd.read_csv(INPUT_CSV)

print(f"Original dataset size: {len(df)}")

# Remove Unwanted Columns

for col in COLUMNS_TO_REMOVE:
    if col in df.columns:
        df.drop(columns=col, inplace=True)

print("Columns removed successfully.")

# Renaming Images Properly
renamed_count = 0
skipped_count = 0

for index, row in df.iterrows():

    patient_id = str(row["Patient ID"])
    old_filename = row["Image Index"]

    old_path = IMAGE_FOLDER / old_filename

    # New standardized format
    formatted_id = str(patient_id).zfill(8)
    new_filename = f"000{formatted_id}_000.png"
    new_path = IMAGE_FOLDER / new_filename

    # If file exists → rename/convert
    if old_path.exists():

        # Convert to PNG (safe even if already PNG)
        img = Image.open(old_path).convert("RGB")
        img.save(new_path)

        # Remove old file if different name
        if old_path != new_path:
            os.remove(old_path)

        # Update CSV
        df.at[index, "Image Index"] = new_filename
        renamed_count += 1

    else:
        skipped_count += 1

print(f"Total images renamed: {renamed_count}")
print(f"Files not found (skipped): {skipped_count}")

# Saving Updated CSV
df.to_csv(OUTPUT_CSV, index=False)

print(f"Updated CSV saved to: {OUTPUT_CSV}")
print("Cleanup completed successfully.")
