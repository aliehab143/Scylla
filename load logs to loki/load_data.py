import csv
import json
import logging
import time
from itertools import islice
from logging import FileHandler, Formatter

# Configuration
CSV_FILE = 'cloud-server-logs.csv'
LOG_FILE = 'cloud-server.log'
PROGRESS_FILE = 'progress.txt'
LOG_BATCH_SIZE = 10
SLEEP_INTERVAL = 10  # seconds

class JSONFormatter(Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record, self.datefmt),
            "type": getattr(record, "type", None),
            "uid": getattr(record, "uid", None),
        }
        return json.dumps(log_entry)

# Set up JSON file logger
logger = logging.getLogger("log_simulator")
logger.setLevel(logging.INFO)

file_handler = FileHandler(LOG_FILE)
file_handler.setFormatter(JSONFormatter())
logger.addHandler(file_handler)

def load_last_index():
    try:
        with open(PROGRESS_FILE, 'r') as f:
            return int(f.read().strip())
    except FileNotFoundError:
        return 0

def save_last_index(index):
    with open(PROGRESS_FILE, 'w') as f:
        f.write(str(index))

def read_csv_in_batches(file_path, batch_size, start_index=0):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for _ in range(start_index):
            next(reader, None)
        while True:
            batch = list(islice(reader, batch_size))
            if not batch:
                break
            yield batch

def push_logs():
    start_index = load_last_index()
    current_index = start_index

    for batch in read_csv_in_batches(CSV_FILE, LOG_BATCH_SIZE, start_index):
        for row in batch:
            log_entry = f"time={row['time']} type={row['type']} uid={row['uid']}"
            extra = {"time": row["time"], "type": row["type"], "uid": row["uid"]}
            logger.info(log_entry, extra=extra)
        current_index += len(batch)
        save_last_index(current_index)
        print(f"Pushed {len(batch)} logs (up to row {current_index})")
        time.sleep(SLEEP_INTERVAL)

if __name__ == '__main__':
    push_logs()