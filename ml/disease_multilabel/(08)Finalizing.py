import pandas as pd
import random
from pathlib import Path

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(03)multiclass_balanced_2300.csv"

OUTPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(04)CNN_ready_multiclass.csv"

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

#Dropping Columns
columns_to_remove = [
    "Follow-up #",
    "OriginalImage[Width",
    "Height]",
    "OriginalImagePixelSpacing[x",
    "y]",
    "Unnamed: 11"
]

df = df.drop(columns=[col for col in columns_to_remove if col in df.columns])

print("Unnecessary columns removed")

# Unique Patient ID generation
max_patient_id = df["Patient ID"].max()

if pd.isna(max_patient_id):
    max_patient_id = 100000

for index, row in df.iterrows():

    # Patient ID
    if pd.isna(row.get("Patient ID")):
        max_patient_id += 1
        df.at[index, "Patient ID"] = max_patient_id

    # Patient Age
    if pd.isna(row.get("Patient Age")):
        df.at[index, "Patient Age"] = random.randint(20, 70)

    # Patient Gender
    if pd.isna(row.get("Patient Gender")):
        df.at[index, "Patient Gender"] = random.choice(["M", "F"])

    # View Position
    if pd.isna(row.get("View Position")):
        df.at[index, "View Position"] = random.choice(["PA", "AP"])

print("Missing values filled")

# Saving final dataset

df.to_csv(OUTPUT_CSV, index=False)

print("\nFinal multiclass CNN dataset created successfully")
print("Saved to:")
print(OUTPUT_CSV)

print("\nFinal dataset size:", len(df))