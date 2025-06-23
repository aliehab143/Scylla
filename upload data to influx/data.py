import pandas as pd
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# InfluxDB configuration
url = "http://localhost:8086"  # Use localhost on Windows, or influxdb in Docker
token = "RHpVBzf5NgbrsjTSgO7m9rXAJiK_1H499t2XcgLOfr6_jekwSZLhPPt2whNZFN4o9BLWJsxQ-vcen_H4VfAAIg=="
org = "myorg"
bucket = "mybucket"

# Read CSV
df = pd.read_csv("cpu_utilization_asg_misconfiguration.csv")  # Adjust path as needed

# Initialize and use client in a context manager
with InfluxDBClient(url=url, token=token, org=org) as client:
    write_api = client.write_api(write_option=SYNCHRONOUS)

    # Convert to points
    points = [
        Point("cpu")
        .tag("source", "csv")
        .field("values", float(row["values"]))
        .time(pd.to_datetime(row["timestamp"], format="%Y-%m-%d %H:%M"), WritePrecision.NS)
        for _, row in df.iterrows()
    ]

    # Write to InfluxDB
    write_api.write(bucket, org, points)
    print("Successfully uploaded CSV to InfluxDB")

    # Query last 100 points
    query_api = client.query_api()
    query = f'''
    from(bucket: "{bucket}")
      |> range(start: 2014-05-14T00:00:00Z, stop: 2014-05-15T00:00:00Z)
      |> filter(fn: (r) => r._measurement == "cpu")
      |> limit(n: 100)
    '''
    result = query_api.query(query=query)

    # Print results
    for table in result:
        for record in table.records:
            print(f"Time: {record.get_time()}, Value: {record.get_value()}")