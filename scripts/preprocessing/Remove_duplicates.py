import pandas as pd
from pathlib import Path

# Path configuration

BASE_PATH = Path(r"E:\Medicine\XRAY-decease-classification\XRAY-ML-system")

INPUT_CSV = BASE_PATH / "data" / "processed" / "(06)Binary_Balanced.csv"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(07)Binary_balanced_final.csv"

# Rows to delete

rows_to_delete = [
53067,53116,53123,53136,53169,53184,53189,53191,53302,53367,
53373,53386,53405,53414,53416,53421,53428,53430,53437,53446,
53454,53463,53473,53483,53493,53505,53515,53526,53536,53548,
53558,53568,53579,53589,53600,53610,53620,53631,53641,53652,
53662,53672,53683,53693,53703,53714,53724,53734,53745,53755,
53766,53776,53786,53797,53807,53818,53828,53838,53849,53859,
53870,53880,53890,53901,53911,53922,53932,53942,53953,53963,
53974,53984,53994,54005,54015,54026,54036,54046,54057,54067,
54078,54088,54098,54109,54119,54130,54140,54150,54161,54171,
54182,54192,54202,54213,54223,54234,54244,54254,54265,54275,
54286,54296,54306,54317,54327,54338,54348,54358
]

# Loading data

df = pd.read_csv(INPUT_CSV)

print("Original dataset size:", len(df))

# Removing rows

df_cleaned = df.drop(index=rows_to_delete)

print("New dataset size:", len(df_cleaned))
print("Total rows removed:", len(df) - len(df_cleaned))

# Save

df_cleaned.to_csv(OUTPUT_CSV, index=False)

print("Cleaned file saved successfully!")