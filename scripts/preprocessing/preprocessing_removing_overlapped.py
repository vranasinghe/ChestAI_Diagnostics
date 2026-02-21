import pandas as pd
from pathlib import Path

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

CSV_PATH = BASE_PATH / "data" / "processed" / "(07)Binary_balanced_final.csv"

df = pd.read_csv(CSV_PATH)

print("Total rows:", len(df))

# If Binary_Label column exists
if "Binary_Label" in df.columns:
    counts = df["Binary_Label"].value_counts().sort_index()

    print("\nBinary Label Distribution:")
    for label, count in counts.items():
        print(f"Label {label}: {count}")

else:
    print("\nBinary_Label column not found. Creating it now...")

    df["Binary_Label"] = df["Finding Labels"].apply(
        lambda x: 0 if str(x).strip() == "No Finding" else 1
    )

    counts = df["Binary_Label"].value_counts().sort_index()

    print("\nBinary Label Distribution (Generated):")
    for label, count in counts.items():
        print(f"Label {label}: {count}")