import pandas as pd
from pathlib import Path

# PROJECT ROOT
BASE_PATH = Path(__file__).resolve().parents[2]

# PATHS
INPUT_CSV = BASE_PATH / "data" / "raw" / "Data_Entry_2017.csv"
OUTPUT_DIR = BASE_PATH / "data" / "processed" / "multi"
OUTPUT_CSV = OUTPUT_DIR / "(01)single_label_only.csv"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Removing all the records with labels including |")

print("Loading dataset...")
df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

#Removing all the multi-disease rows (rows containing "|")
single_label_df = df[~df["Finding Labels"].str.contains("\|")]

print("Single disease rows:", len(single_label_df))

#Saving the preprocessed file
single_label_df.to_csv(OUTPUT_CSV, index=False)

print("\nSaved file:")
print(OUTPUT_CSV)

print("Completed..\n")