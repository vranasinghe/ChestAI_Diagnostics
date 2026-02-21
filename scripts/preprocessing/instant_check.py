import pandas as pd
from pathlib import Path

# ==========================
# PATH CONFIGURATION
# ==========================

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

CSV_PATH = BASE_PATH / "data" / "processed" / "(08)Binary_balanced_deduplicated.csv"
IMAGES_BASE = BASE_PATH / "data" / "raw"

# ==========================
# LOAD DATA
# ==========================

df = pd.read_csv(CSV_PATH)

print("\n===== DATASET SUMMARY =====")
print("Total Records:", len(df))

# ==========================
# BINARY LABEL DISTRIBUTION
# ==========================

print("\n===== BINARY LABEL DISTRIBUTION =====")
print(df["Binary_Label"].value_counts())

# ==========================
# DUPLICATE CHECK
# ==========================

duplicates = df[df.duplicated(subset=["Image Index"], keep=False)]

print("\n===== DUPLICATE IMAGE INDEX CHECK =====")
print("Duplicate rows:", len(duplicates))

# ==========================
# MISSING IMAGE FILE CHECK
# ==========================

print("\n===== MISSING IMAGE FILE CHECK =====")

missing_files = 0

for image_name in df["Image Index"]:
    found = False

    for i in range(1, 13):
        folder = IMAGES_BASE / f"images_{str(i).zfill(3)}" / image_name
        if folder.exists():
            found = True
            break

    if not found:
        missing_files += 1

print("Missing image files:", missing_files)

print("\n===== CHECK COMPLETE =====")