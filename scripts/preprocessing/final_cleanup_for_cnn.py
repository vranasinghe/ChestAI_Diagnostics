import pandas as pd
from pathlib import Path

# PATH CONFIGURATION

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "(09)Binary_balanced_FINAL.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(10)CNN_ready.csv"

# LOAD DATA

df = pd.read_csv(INPUT_CSV)

print("Original columns:")
print(df.columns.tolist())
print("\nOriginal dataset size:", len(df))

# COLUMNS TO REMOVE

COLUMNS_TO_REMOVE = [
    "Unnamed: 11",
    "Follow-up #",
    "Dataset_Source",
    "OriginalImage[Width",
    "Height]",
    "OriginalImagePixelSpacing[x",
    "y]"
]

# Remove only if exists
df = df.drop(columns=[col for col in COLUMNS_TO_REMOVE if col in df.columns])

print("\nRemaining columns:")
print(df.columns.tolist())

# SAVE CLEAN DATASET

df.to_csv(OUTPUT_CSV, index=False)

print("\nCNN-ready dataset saved to:")
print(OUTPUT_CSV)
print("\nFinal dataset size:", len(df))