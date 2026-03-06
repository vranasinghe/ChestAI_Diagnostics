import pandas as pd
from pathlib import Path

BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "raw" / "Data_Entry_2017.csv"

OUTPUT_DIR = BASE_PATH / "data" / "processed" / "multi"
OUTPUT_CSV = OUTPUT_DIR / "(02)expanded_single_labels.csv"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

#Loading data

print("Loading dataset...")

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

#Expanding

expanded_rows = []

for _, row in df.iterrows():

    labels = row["Finding Labels"].split("|")

    for label in labels:

        if label == "Hernia":
            continue

        new_row = row.copy()
        new_row["Finding Labels"] = label

        expanded_rows.append(new_row)

expanded_df = pd.DataFrame(expanded_rows)

print("\nExpanded dataset size:", len(expanded_df))

#Saving request

expanded_df.to_csv(OUTPUT_CSV, index=False)

print("\nExpanded dataset saved to:")
print(OUTPUT_CSV)

print("\nProcess completed.")