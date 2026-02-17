import pandas as pd
from pathlib import Path

#Configuration
BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "(01)Data_preprocessing_Feature_Removal.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(02)Data_preprocessing_DroppedColumns.csv"

COLUMNS_TO_REMOVE = [
    "Follow-up #",
    "OriginalImage[Width",
    "Height]",
    "OriginalImagePixelSpacing[x",
    "y]"
]

#Loading the dataset

print("Loading dataset...")
df = pd.read_csv(INPUT_CSV)

print(f"Original Shape: {df.shape}")

#Dropping columns

df = df.drop(columns=COLUMNS_TO_REMOVE, errors="ignore")

print(f"Shape of the dataframe after dropping columns: {df.shape}")

#Saving processed dataset

OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(OUTPUT_CSV, index=False)

print(f"\nProcessed dataset saved to: \n{OUTPUT_CSV}")
print("\nColumn removal completed successfully.")