from influxdb_client import InfluxDBClient

url = "http://localhost:8086"  # Use localhost on Windows, or influxdb in Docker
token = "RHpVBzf5NgbrsjTSgO7m9rXAJiK_1H499t2XcgLOfr6_jekwSZLhPPt2whNZFN4o9BLWJsxQ-vcen_H4VfAAIg=="
org = "myorg"
bucket = "csv"

client = InfluxDBClient(url=url, token=token, org=org)

query = f'''
from(bucket: "{bucket}")
  |> range(start: -1y)
  |> filter(fn: (r) => r._measurement == "cpu")
'''

tables = client.query_api().query(query)

for table in tables:
    for row in table.records:
        print(f"{row.get_time()} - {row.get_value()}")
