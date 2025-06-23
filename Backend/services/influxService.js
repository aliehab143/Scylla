const { toUnixTimestamp , isUnixTimestamp} = require('../helpers/helper');

const { InfluxDB } = require('@influxdata/influxdb-client');

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const url = process.env.INFLUX_URL;

const influxDB = new InfluxDB({ url, token });


async function queryInflux( startTime, endTime, table , bucket, limit=100) {
  const queryApi = influxDB.getQueryApi(org);

  console.log('startTime, endTime', startTime, endTime);
  
  let startUnix, endUnix;

  if (!isUnixTimestamp(startTime)) {
    startUnix = toUnixTimestamp(startTime);
    endUnix = toUnixTimestamp(endTime);
  } else {
    startUnix = Number(startTime);
    endUnix = Number(endTime);
  }

  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${startUnix}, stop: ${endUnix})
      |> filter(fn: (r) => r._measurement == "${table}")
      |> limit(n:${limit})
  `;
  console.log(fluxQuery)
  const rows = [];

  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rows.push(o);
      },
      error(error) {
        console.error('Query error', error);
        reject(error);
      },
      complete() {
        resolve(rows);
      },
    });
  });
}

module.exports = { queryInflux };
