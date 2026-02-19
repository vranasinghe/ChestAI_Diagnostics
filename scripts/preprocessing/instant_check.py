import pandas as pd
from collections import Counter
from pathlib import Path

# Configuration

BASE_PATH = Path(__file__).resolve().parents[2]
DATA_CSV = BASE_PATH / "data" / "processed" / "(04)Data_with_External_Pneumonia.csv"

# Load Dataset

df = pd.read_csv(DATA_CSV)

print(f"\nTotal Records: {len(df)}")

# Count Multi-Label Diseases

disease_counter = Counter()

for labels in df["Finding Labels"]:
    diseases = labels.split("|")
    for disease in diseases:
        disease_counter[disease] += 1

# Print Results

print("\nClass Distribution:\n")
for disease, count in sorted(disease_counter.items(), key=lambda x: x[1], reverse=True):
    print(f"{disease:20s} : {count}")

print("\nTotal Unique Classes:", len(disease_counter))
