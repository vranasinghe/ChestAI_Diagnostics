import pandas as pd
from pathlib import Path

# PATH CONFIGURATION

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "(08)Binary_balanced_deduplicated.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(09)Binary_balanced_FINAL.csv"

# LOAD DATA

df = pd.read_csv(INPUT_CSV)

print("Original Dataset Size:", len(df))

# SPLIT CLASSES

df_diseased = df[df["Binary_Label"] == 1]
df_no_finding = df[df["Binary_Label"] == 0]

print("Diseased:", len(df_diseased))
print("No Finding:", len(df_no_finding))

# BALANCE DATASET

target_count = len(df_no_finding)

# Randomly sample diseased to match no_finding
df_diseased_balanced = df_diseased.sample(n=target_count, random_state=42)

# Combine
df_final = pd.concat([df_diseased_balanced, df_no_finding], ignore_index=True)

# Shuffle dataset
df_final = df_final.sample(frac=1, random_state=42).reset_index(drop=True)

# SAVE

df_final.to_csv(OUTPUT_CSV, index=False)

print("Final Dataset Size:", len(df_final))
print("\nFinal Distribution:")
print(df_final["Binary_Label"].value_counts())
print("\nSaved to:", OUTPUT_CSV)