import pandas as pd
import os
from pathlib import Path
import random

# Configuration
BASE_PATH = Path(__file__).resolve().parents[2]

DATA_CSV = BASE_PATH / "data" / "processed" / "(02)Data_preprocessing_DroppedColumns.csv"
IMAGES_ROOT = BASE_PATH / "data" / "raw"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(03)Data_preprocessing_Balanced(Part01).csv"

KEEP_NO_FINDING = 2300
RANDOM_SEED = 42
removed_count = 0

# Load dataset
df = pd.read_csv(DATA_CSV)
print("Columns in CSV:", df.columns.tolist())  # Check exact column names
print(f"Dataset size before balancing: {len(df)}")

# Replace with exact column name from print above
col = "Finding Labels"

# Separate No Finding
no_finding_df = df[df[col] == "No Finding"]
diagnosed_df = df[df[col] != "No Finding"]

print(f"Total 'No Finding' records: {len(no_finding_df)}")
print(f"Total 'Diseased' records: {len(diagnosed_df)}")

# Randomly select 2300
no_finding_keep = no_finding_df.sample(n=KEEP_NO_FINDING, random_state=RANDOM_SEED)
no_finding_remove = no_finding_df.drop(no_finding_keep.index)

# Create balanced dataset
balanced_df = pd.concat([diagnosed_df, no_finding_keep]).reset_index(drop=True)
print(f"Balanced dataset size: {len(balanced_df)}")

# Save CSV
balanced_df.to_csv(OUTPUT_CSV, index=False)
print(f"CSV saved to: {OUTPUT_CSV}")

# Remove excess images
for image_name in no_finding_remove["Image Index"]:
    for folder in IMAGES_ROOT.glob("images_*"):
        #Checking out folder/images/image_name
        image_path2 = folder / "images" / image_name

        if image_path2.exists():
            os.remove(image_path2)
            removed_count += 1


print(f"Total images removed: {removed_count}")
print("\nBalancing completed successfully.")
