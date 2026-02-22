import pandas as pd
from pathlib import Path

BASE_PATH = Path(__file__).resolve().parents[2]

TRAIN_CSV = BASE_PATH / "data" / "processed" / "(11)binary_train.csv"
VAL_CSV   = BASE_PATH / "data" / "processed" / "(12)binary_val.csv"
TEST_CSV  = BASE_PATH / "data" / "processed" / "(13)binary_test.csv"

# Load
train_df = pd.read_csv(TRAIN_CSV)
val_df   = pd.read_csv(VAL_CSV)
test_df  = pd.read_csv(TEST_CSV)

print("Split verification")

#Checking the patient overlap
train_patients = set(train_df["Patient ID"])
val_patients   = set(val_df["Patient ID"])
test_patients  = set(test_df["Patient ID"])

print("Patient Overlap Check:")
print("Train ∩ Val:", len(train_patients & val_patients))
print("Train ∩ Test:", len(train_patients & test_patients))
print("Val ∩ Test:", len(val_patients & test_patients))

#Binary distribution
print("\nBinary Distribution:")

print("\nTrain:")
print(train_df["Binary_Label"].value_counts())

print("\nValidation:")
print(val_df["Binary_Label"].value_counts())

print("\nTest:")
print(test_df["Binary_Label"].value_counts())

#Checking total rows
total_rows = len(train_df) + len(val_df) + len(test_df)
print("\nTotal rows across splits:", total_rows)

print("Verification complete...")