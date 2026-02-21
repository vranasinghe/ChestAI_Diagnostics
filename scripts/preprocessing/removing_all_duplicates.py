import pandas as pd
from pathlib import Path

# PATH CONFIGURATION

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "(07)Binary_balanced_final.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(08)Binary_balanced_deduplicated.csv"

# LOAD DATA

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

# REMOVE DUPLICATES

# Keep first occurrence only
df_cleaned = df.drop_duplicates(subset=["Image Index"], keep="first")

removed_rows = len(df) - len(df_cleaned)

print("Duplicate rows removed:", removed_rows)
print("New dataset size:", len(df_cleaned))

# SAVE CLEAN FILE

df_cleaned.to_csv(OUTPUT_CSV, index=False)

print("Clean dataset saved to:", OUTPUT_CSV)
print("Done.")