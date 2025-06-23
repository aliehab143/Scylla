require('dotenv').config();
const { Point } = require('@influxdata/influxdb-client');

async function writeCpuData(influxClient, value, isAnomaly) {
    const writeApi = influxClient.getWriteApi(process.env.INFLUXDB_ORG, process.env.INFLUXDB_BUCKET);
    
    const point = new Point('cpu')
        .floatField('value', value)
        .booleanField('isAnomaly', isAnomaly)
        .timestamp(new Date()); // Current time, or specify your own

    writeApi.writePoint(point);
    await writeApi.close();
    console.log('CPU data written to InfluxDB');
}