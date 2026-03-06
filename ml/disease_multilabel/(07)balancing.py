import pandas as pd
from pathlib import Path

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(02b)expanded_single_labels_with_external_pneumonia.csv"

OUTPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(03)multiclass_balanced_2300.csv"

TARGET_PER_CLASS = 2300

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

classes = df["Finding Labels"].unique()

balanced_data = []

#Sample 2300 from each class

for disease in classes:

    class_rows = df[df["Finding Labels"] == disease]

    if len(class_rows) < TARGET_PER_CLASS:
        print(f"{disease} -> NOT ENOUGH IMAGES ({len(class_rows)})")
        continue

    sampled = class_rows.sample(n=TARGET_PER_CLASS, random_state=42)

    balanced_data.append(sampled)

    print(f"{disease} -> {TARGET_PER_CLASS} selected")

#Merging

df_balanced = pd.concat(balanced_data, ignore_index=True)

print("\nFinal dataset size:", len(df_balanced))

#Saving

df_balanced.to_csv(OUTPUT_CSV, index=False)

print("\nBalanced dataset saved to:")
print(OUTPUT_CSV)