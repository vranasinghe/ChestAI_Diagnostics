import pandas as pd
from pathlib import Path

# PROJECT ROOT
BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "multi" / "(01)single_label_only.csv"

print("Checking whether each class contains 2300 images\n")

df = pd.read_csv(INPUT_CSV)

print("Dataset size:", len(df))

# Count each disease
class_counts = df["Finding Labels"].value_counts().sort_values(ascending=False)

print("\nDisease Distribution:\n")
print(class_counts)

print("\nTotal Classes:", len(class_counts))

# Check if each class has >= 2300 images
print("\nChecking if each class has at least 2300 images...\n")

for disease, count in class_counts.items():
    if count >= 2300:
        print(f"{disease:20} OK ({count})")
    else:
        print(f"{disease:20} NOT ENOUGH ({count})")

print("Completed")