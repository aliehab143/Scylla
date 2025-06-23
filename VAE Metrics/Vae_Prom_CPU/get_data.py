import pandas as pd
import json

# Step 1: Read the CSV file
# Replace 'your_file.csv' with the path to your CSV file
csv_file = 'cpu_utilization.csv'
df = pd.read_csv(csv_file)

# Step 2: Calculate the number of rows for the last 30%
total_rows = len(df)
last_30_percent_rows = int(total_rows * 0.3)

# Step 3: Extract the last 30% of the rows
last_30_percent_df = df.tail(last_30_percent_rows)

# Step 4: Convert the DataFrame to the required JSON format
# Assuming the CSV has columns named 'time' and 'value'
# If your columns have different names, adjust them accordingly
json_data = [
    {"time": row['timestamp'], "value": float(row['value'])}
    for _, row in last_30_percent_df.iterrows()
]

# Step 5: Write the JSON data to a file
json_file = 'last_30_percent.json'
with open(json_file, 'w') as f:
    json.dump(json_data, f, indent=2)

print(f"Successfully converted the last 30% of the CSV ({last_30_percent_rows} rows) to JSON and saved to {json_file}")