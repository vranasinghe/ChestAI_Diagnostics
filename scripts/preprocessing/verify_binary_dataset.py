import pandas as pd
from pathlib import Path

BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "(10)CNN_ready.csv"
IMAGES_BASE = BASE_PATH / "data" / "raw"

# LOAD DATA
df = pd.read_csv(INPUT_CSV)

print("========== DATASET VERIFICATION ==========\n")
print("Total rows:", len(df))
print("Total columns:", len(df.columns))

# CHECK 1 — Duplicate Image Index
duplicate_count = df["Image Index"].duplicated().sum()
print("\nDuplicate Image Index rows:", duplicate_count)

# CHECK 2 — Binary Label Distribution
if "Binary_Label" not in df.columns:
    print("\nERROR: Binary_Label column NOT found!")
else:
    print("\nBinary Label Distribution:")
    print(df["Binary_Label"].value_counts())

# CHECK 3 — Missing Image Files

missing_files = 0

for image_name in df["Image Index"]:

    found = False

    # Search inside images_001/images ... images_012/images
    for i in range(1, 13):
        folder = IMAGES_BASE / f"images_{str(i).zfill(3)}" / "images"
        image_path = folder / image_name

        if image_path.exists():
            found = True
            break

    if not found:
        missing_files += 1

print("\nMissing image files:", missing_files)
print("Checked images:", len(df))

print("\n========== VERIFICATION COMPLETE ==========")