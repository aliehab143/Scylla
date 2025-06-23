import pandas as pd
from datetime import datetime
import sys

def convert_to_line_protocol(df, measurement="cpu"):
    lines = []

    for _, row in df.iterrows():
        dt = pd.to_datetime(row['timestamp'])
        timestamp_ns = int(dt.timestamp() * 1e9)
        line = f"{measurement} value={row['values']} {timestamp_ns}"
        lines.append(line)
    
    return lines

def main(csv_file, output_file):
    df = pd.read_csv(csv_file)
    lines = convert_to_line_protocol(df)

    with open(output_file, 'w') as f:
        for line in lines:
            f.write(line + '\n')

    print(f"Exported {len(lines)} lines to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python csv_to_line_protocol.py <input.csv> <output.txt>")
        sys.exit(1)

    main(sys.argv[1], sys.argv[2])
