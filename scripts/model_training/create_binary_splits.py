import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split

BASE_PATH = Path(__file__).resolve().parents[2]

INPUT_CSV = BASE_PATH / "data" / "processed" / "(10)CNN_ready.csv"

OUTPUT_TRAIN = BASE_PATH / "data" / "processed" / "(11)binary_train.csv"
OUTPUT_VAL   = BASE_PATH / "data" / "processed" / "(12)binary_val.csv"
OUTPUT_TEST  = BASE_PATH / "data" / "processed" / "(13)binary_test.csv"

# Load dataset
df = pd.read_csv(INPUT_CSV)

print("Total dataset size:", len(df))

# Unique patients
unique_patients = df["Patient ID"].unique()
print("Total unique patients:", len(unique_patients))

# First split: Train (70%) + Temp (30%)
train_patients, temp_patients = train_test_split(
    unique_patients,
    test_size=0.30,
    random_state=42
)

# Second split: Validation (15%) + Test (15%)
val_patients, test_patients = train_test_split(
    temp_patients,
    test_size=0.50,
    random_state=42
)

# Create datasets
train_df = df[df["Patient ID"].isin(train_patients)]
val_df   = df[df["Patient ID"].isin(val_patients)]
test_df  = df[df["Patient ID"].isin(test_patients)]

print("\nTrain size:", len(train_df))
print("Validation size:", len(val_df))
print("Test size:", len(test_df))

# Save files
train_df.to_csv(OUTPUT_TRAIN, index=False)
val_df.to_csv(OUTPUT_VAL, index=False)
test_df.to_csv(OUTPUT_TEST, index=False)

print("\nBinary splits created successfully.")