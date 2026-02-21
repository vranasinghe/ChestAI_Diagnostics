import pandas as pd
from pathlib import Path

# Configuration

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "(06)Binary_Balanced.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(07)Binary_balanced_final.csv"

COLUMNS_TO_REMOVE = [
    "Unnamed: 11",
    "Follow-up #",
    "Dataset_Source",
    "OriginalImage[Width",
    "Height]",
    "OriginalImagePixelSpacing[x",
    "y]"
]

# Load Dataset

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))
print("Original columns:", len(df.columns))

# Remove Columns Safely

removed_columns = []

for col in COLUMNS_TO_REMOVE:
    if col in df.columns:
        df.drop(columns=col, inplace=True)
        removed_columns.append(col)

print("\nRemoved columns:")
for col in removed_columns:
    print(" -", col)

print("\nRemaining columns:", len(df.columns))

# Save Cleaned Dataset

df.to_csv(OUTPUT_CSV, index=False)

print("\nCleaned CSV saved to:")
print(OUTPUT_CSV)
print("\nCleanup completed successfully.")