import pandas as pd
from pathlib import Path

BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(02)expanded_single_labels.csv"

OUTPUT_DIR = BASE_PATH / "data" / "processed" / "multi"
OUTPUT_CSV = OUTPUT_DIR / "(03)multiclass_balanced_2300.csv"

SAMPLES_PER_CLASS = 2300


print("Loading expanded dataset...")

df = pd.read_csv(INPUT_CSV)

print("Dataset size:", len(df))

# Removing hernia

df = df[df["Finding Labels"] != "Hernia"]

print("\nHernia removed")

#Distributing classes

print("\nClass distribution before balancing:\n")
print(df["Finding Labels"].value_counts())

#Creating Balanced dataset

balanced_rows = []

classes = df["Finding Labels"].unique()

print("\nSelecting 2300 images per class...\n")

for disease in classes:

    disease_df = df[df["Finding Labels"] == disease]

    if len(disease_df) < SAMPLES_PER_CLASS:
        print(f"{disease} -> NOT ENOUGH IMAGES ({len(disease_df)})")
        continue

    sampled = disease_df.sample(n=SAMPLES_PER_CLASS, random_state=42)

    balanced_rows.append(sampled)

    print(f"{disease} -> {SAMPLES_PER_CLASS} selected")

balanced_df = pd.concat(balanced_rows)

# Saving Dataset

balanced_df.to_csv(OUTPUT_CSV, index=False)

print("\nBalanced dataset created successfully")

print("Final dataset size:", len(balanced_df))

print("\nSaved to:")
print(OUTPUT_CSV)