import pandas as pd
from pathlib import Path

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(02b)expanded_single_labels_with_external_pneumonia.csv"

EXPECTED_PER_CLASS = 2300


df = pd.read_csv(INPUT_CSV)

print("Multi class check")

print("Total rows:", len(df))

#Class distribution
distribution = df["Finding Labels"].value_counts()

print("\nClass Distribution:\n")

for disease, count in distribution.items():

    if count == EXPECTED_PER_CLASS:
        status = "OK"
    else:
        status = "NOT BALANCED"

    print(f"{disease:<20} {count:<6} {status}")

#Class count

print("\nTotal Classes:", len(distribution))

expected_total = EXPECTED_PER_CLASS * len(distribution)

print("Expected Total Rows:", expected_total)

if len(df) == expected_total:
    print("\nDataset size is correct.")
else:
    print("\nDataset size mismatch.")

print("Check complete")