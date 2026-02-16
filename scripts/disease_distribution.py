import pandas as pd
from collections import Counter

#Loading the dataset
df = pd.read_csv("data/Data_Entry_2017.csv")

#Extracting disease labels column
labels = df["Finding Labels"]

#Splitting multi-label records and flatten
all_diseases = []

for entry in labels:
    diseases = entry.split("|")
    all_diseases.extend(diseases)

#Counting occurrences
disease_counts = Counter(all_diseases)

#Converting to a Dataframe
distribution_df = pd.DataFrame(
    disease_counts.items(),
    columns=["Disease", "Count"]
).sort_values(by="Count", ascending=False)

print("\nDisease Distribution: \n")
print(distribution_df)

distribution_df.to_csv("data/disease_distribution.csv", index=False)

print("\nSaved distribution to data/disease_distribution.csv")