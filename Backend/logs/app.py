import csv
import json
from datetime import datetime
import pytz
import time
import os

# Configuration
CSV_FILE = r"C:\Users\Ahmed mokhtar\Downloads\combined_logs.csv"
OUTPUT_LOG_FILE = "logs/app.log"

# Ensure logs directory exists
os.makedirs(os.path.dirname(OUTPUT_LOG_FILE), exist_ok=True)

def parse_timestamp(timestamp_str):
    """Convert timestamp string to a formatted string for Promtail."""
    try:
        dt_str = timestamp_str.split('+')[0]
        base_dt, fractional = dt_str.split('.')
        fractional = fractional[:6]  # Truncate to microseconds
        adjusted_dt_str = f"{base_dt}.{fractional}"
        dt = datetime.strptime(adjusted_dt_str, '%Y-%m-%d %H:%M:%S.%f')
        utc_dt = pytz.UTC.localize(dt)
        return utc_dt.isoformat()
    except ValueError as e:
        print(f"Error parsing timestamp '{timestamp_str}': {e}")
        return None

def process_csv_to_logs():
    """Read CSV and write logs to a file for Promtail, one log per second."""
    with open(CSV_FILE, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile, fieldnames=['type', 'time', 'uid'])
        next(csv_reader)  # Skip header if it exists
        
        with open(OUTPUT_LOG_FILE, 'a') as logfile:
            for i, row in enumerate(csv_reader, 1):
                print(f"Row {i}: type={row['type']}, time={row['time']}, uid={row['uid']}")
                timestamp = parse_timestamp(row['time'])
                if timestamp is None:
                    continue
                
                log_message = json.dumps({
                    # here 
                    "time": timestamp,
                    "type": row['type'],
                    "uid": row['uid']
                })
                log_line = f"{timestamp} {log_message}\n"
                logfile.write(log_message   )
                logfile.flush()  # Ensure the write is immediate for Promtail to pick up
                print(f"Wrote: {log_line.strip()}")
                time.sleep(1)  # 1 log per second

def main():
    print(f"Starting CSV to log file processing for Promtail (1 log per second)...")
    try:
        process_csv_to_logs()
        print(f"Logs written to {OUTPUT_LOG_FILE} successfully")
    except KeyboardInterrupt:
        print("Log generation interrupted by user (Ctrl+C). Stopping gracefully...")
    except Exception as e:
        print(f"Error processing logs: {e}")

if __name__ == "__main__":
    main()