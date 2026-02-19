import pandas as pd
import shutil
import random
from pathlib import Path
from PIL import Image

# Configuration

BASE_PATH = Path(__file__).resolve().parents[2]

NIH_CSV = BASE_PATH / "data" / "processed" / "(03)Data_preprocessing_Balanced(Part01).csv"
NEW_DATASET_PATH = Path("E:/Medicine/chest_xray/train/PNEUMONIA")
DESTINATION_FOLDER = BASE_PATH / "data" / "raw" / "images_012" / "images"
OUTPUT_CSV = BASE_PATH / "data" / "processed" / "(04)Data_with_External_Pneumonia.csv"

NUM_IMAGES_TO_ADD = 900
RANDOM_SEED = 42

random.seed(RANDOM_SEED)

# Load Existing Dataset

df = pd.read_csv(NIH_CSV)

print(f"Existing dataset size: {len(df)}")

# Get current max patient ID
max_patient_id = df["Patient ID"].max()

# Select 900 Pneumonia Images

all_images = list(NEW_DATASET_PATH.glob("*.jpeg"))
print(f"Total images found: {len(all_images)}")
selected_images = random.sample(all_images, NUM_IMAGES_TO_ADD)

print(f"Selected {len(selected_images)} pneumonia images")

# Generate Metadata + Copy Images

new_rows = []

for idx, image_path in enumerate(selected_images):

    new_patient_id = max_patient_id + idx + 1
    new_filename = f"000{new_patient_id}_000.png"

    destination_path = DESTINATION_FOLDER / new_filename

    # Convert to PNG and copy
    img = Image.open(image_path).convert("RGB")
    img.save(destination_path)

    new_row = {
        "Image Index": new_filename,
        "Finding Labels": "Pneumonia",
        "Follow-up #": 0,
        "Patient ID": new_patient_id,
        "Patient Age": random.randint(20, 70),
        "Patient Gender": random.choice(["M", "F"]),
        "View Position": random.choice(["PA", "AP"]),
        "Dataset_Source": "KAGGLE_PNEUMONIA"
    }

    new_rows.append(new_row)

print("Metadata generated.")

# Append To Dataset

df_new = pd.DataFrame(new_rows)
final_df = pd.concat([df, df_new], ignore_index=True)

print(f"Final dataset size: {len(final_df)}")

final_df.to_csv(OUTPUT_CSV, index=False)
print(f"Updated CSV saved to: {OUTPUT_CSV}")

print("External pneumonia integration completed successfully.")
