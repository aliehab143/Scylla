require('dotenv').config();
const axios = require('axios');
const grafanaAPI = require('../api/grafanaAPI');
const dashboard = require('../models/Dashboard');
const UserWorkflow = require('../models/UserWorkflow');
const csvParser = require('csv-parser');
const fs = require('fs');
const { Console } = require('console');
const Dashboard = require('../models/Dashboard');
const { Point } = require('@influxdata/influxdb-client');
const { model } = require('mongoose');
const { type } = require('os');
const path = require('path');
const fs2 = require('fs').promises;
const modelController = require('../controllers/model')
const { infoLog, errorLog } = require('../logger');
const { toUnixTimestamp, isUnixTimestamp } = require('../helpers/helper');
const influxService = require('../services/influxService')

const getAllDashboards = async (req, res) => {
  try {

    const response = await grafanaAPI.get('/api/search');
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    res.status(500).json({ msg: error });
  }
};


const getDashboardDeprycated = async (req, res) => {
  try {
    const uid = req.params.uid;
    console.log(uid)
    const response = await grafanaAPI.get(`/api/dashboards/uid/${uid}`);
    console.log(response.data);
    res.json(response);

  } catch (error) {
    console.error("Error fetching dashboards:", error);
    res.status(500).json({ msg: error });
  }

};


const prometheusToAnomalyDetection = async (start, end , query, limit) => {
  
  let bucket ="prometheus";
  const prometheusData = await influxService.queryInflux(start, end, query, bucket, limit);
  
  // remove timestamp from prometheusData because i want to send values to model
  const modifiedData = prometheusData.map(metrics => metrics._value);

  console.log('modifiedData', modifiedData)
  const modelResponse = await modelController.detectCpuAnomaly(modifiedData)
  console.log('model response', modelResponse)
  
  const response = {
    data: prometheusData.map(item => ({
      timestamp: item._time,
      value: item._value,
      
    })),
    modelPrediction: modelResponse
  }
  
  return response;
}
// get loki logs
const getLokiLogs = async (hostURL, params) => {
  console.log('in getLokiLogs function')
  console.log('hostURL', hostURL, 'params', params)
  const response = await axios.get(`${hostURL}/loki/api/v1/query_range`, { params });

  const { data: { data: { result } } } = response;
  console.log('result is ', result);

  // Flatten and merge timestamp with parsed log object
  const logs = result.flatMap(({ values }) =>
    values.map(([timestamp, logLine]) => {
      const parsedLog = JSON.parse(logLine.trim());
      return {
        timestamp,
        ...parsedLog
      };
    })
  );

  return logs;
};


const getDashboardrById = async (req, res) => {
  const user_id = req.user.id;
  try {
    const dashboard_id = req.params.uid;
    const data = await dashboard.findById({ _id: dashboard_id }).populate('datasource');
    const results = [];

    console.log('host url  is ', data.datasource.hostURL)


    if (data.datasource.type === 'csv') {
      const csvFilePath = data.datasource.path;
      console.log(data.datasource.path)
      if (!fs.existsSync(csvFilePath)) {
        return res.status(404).json({ error: 'CSV file not found on the server.' });
      }

      // Read and parse the CSV file
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          infoLog(user_id, 'get_dashboard_csv', dashboard_id);
          res.json({ ...data.toObject(), data: results });
        })
        .on('error', (err) => {
          console.error('Error parsing CSV:', err.message);
          res.status(500).json({ error: 'Failed to parse CSV file.', details: err.message });
        });
    }

    else if (data.datasource.type === 'prometheus') {
      
      let { query, start, end, step, limit } = req.query;
      console.log('req.queries', req.query)
      
      if(!start || !end) {
        const now = new Date();
        end = now.toISOString();
        start = new Date(now - 0.5 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      }
      
      let startUnix, endUnix;
      if (!isUnixTimestamp(start)) {
        startUnix = toUnixTimestamp(start);
        endUnix = toUnixTimestamp(end);
      } else {
        startUnix = Number(start);
        endUnix = Number(end);
      }
      
      const response = await prometheusToAnomalyDetection(startUnix, endUnix, query, limit);

      infoLog(user_id, 'get_dashboard_prometheus', dashboard_id);
      return res.json(
        response,
      );
    }

    // 1st time get all logs
    // 2nd time get new logs 

    else if (data.datasource.type === 'loki') {
      try {
        /* 
          * if no params return logs from last 1 hr
          * loki defaults start from 1 hr ago
          * end defaults to now
        */

        // if no params return logs from last 1 hr
        const now = new Date();
        const end1 = now.toISOString();
        // Set a predefined early start time (e.g., 7 days ago)
        const defaultStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

        const { query, limit, start, end } = req.query;

        // Parameters for fetching large dataset from Loki
        const fetchParams = {
          query: query || '{job="cloud-server-logs"}',
          limit: parseInt(limit) || 10, // Increased limit for broader data
          start: defaultStart, // Use early start time for broad data fetch
          end: end1
        };

       const logs = await getLokiLogs(data.datasource.hostURL, fetchParams);

        infoLog(user_id, 'get_dashboard_loki', dashboard_id);
        return res.json(logs)


      } catch (error) {
        console.error('Error processing Loki logs:', error);
        res.status(500).json({
          status: 'error',
          message: 'Failed to process logs',
          error: error.message
        });
      }
    }



    else {

      res.json(data);
    }



  } catch (error) {
    console.error('Error in dashboards:', error.message);
    res.status(500).json({ message: error });
  }
}


const addDashboard = async (req, res) => {
  try {

    const user_id = req.user.id;
    const datasource_id = req.params.uid;

    const savedDashboard = await dashboard.create({
      ...req.body,
      datasource: datasource_id
    });

    console.log(savedDashboard.datasource)
    const dashboard_id = savedDashboard._id;

    const userworkflow = await UserWorkflow.findOne({ user_id })
    console.log('userworkflow is ', userworkflow)

    userworkflow.dashboards.push(dashboard_id);

    console.log('dashboards', userworkflow.dashboards);
    await userworkflow.save();

    res.json(savedDashboard);

  } catch (error) {
    console.error('error:', error.message);
    res.status(500).json({ message: error.message });

  }
}


const addDatasource = async (req, res) => {
  try {

    const user_id = req.user.id;
    const dashboard_id = req.params.id

    const dashboard2 = await dashboard.findOne({});


    const userworkflow = await UserWorkflow.findOne({ user_id })
    userworkflow.dashboards.push(dashboard_id);

    console.log('dashboards', userworkflow.dashboards);
    await userworkflow.save();

    res.json(savedDatasourcee);



  } catch (error) {
    console.error('error:', error.message);
    res.status(500).json({ message: error.message });
  }

}

const deleteDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.uid;
    const userId = req.user.id;

    // Find the user's workflow
    const userWorkflow = await UserWorkflow.findOne({ user_id: userId });
    if (!userWorkflow) {
      return res.status(404).json({ message: 'User workflow not found' });
    }

    // Check if the dashboard belongs to the user
    const dashboardIndex = userWorkflow.dashboards.indexOf(dashboardId);
    if (dashboardIndex === -1) {
      return res.status(404).json({ message: 'Dashboard not found for this user' });
    }

    // Remove the dashboard from the user's workflow
    userWorkflow.dashboards.splice(dashboardIndex, 1);
    await userWorkflow.save();

    // Delete the dashboard document
    const deletedDashboard = await dashboard.findByIdAndDelete(dashboardId);
    if (!deletedDashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.json({ message: 'Dashboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ message: 'Error deleting dashboard', error: error.message });
  }
};


// Function to parse concatenated JSON logs from file
const parseLogFile = async (filePath) => {
  try {
    const logContent = await fs2.readFile(filePath, 'utf8');
    if (!logContent.trim()) return [];

    // Split the concatenated string into individual JSON objects
    const logEntries = logContent.split('}{');
    const parsedLogs = [];

    for (let i = 0; i < logEntries.length; i++) {
      let entry = logEntries[i];
      // Add back braces removed by split
      if (i === 0) {
        entry = entry + '}';
      } else if (i === logEntries.length - 1) {
        entry = '{' + entry;
      } else {
        entry = '{' + entry + '}';
      }
      try {
        const parsedEntry = JSON.parse(entry);
        parsedLogs.push(parsedEntry);
      } catch (error) {
        console.error(`Failed to parse log entry at index ${i}:`, entry, error.message);
      }
    }

    return parsedLogs;
  } catch (error) {
    console.error('Error reading or parsing log file:', error.message);
    return [];
  }
};

const fetchLokiDataFile = async (res = null) => {
  try {
    const now = new Date();
    const end1 = now.toISOString();
    const defaultStart = new Date(now - 60 * 60 * 1000).toISOString(); // Default to last hour

    // Define log file path
    const logFilePath = path.join(__dirname, '..', 'Generate logs Server', 'logs', 'app.log');
    console.log('Reading logs from:', logFilePath);

    // Read and parse logs from file (allLogs matches app.log structure)
    const allLogs = await parseLogFile(logFilePath);
    // console.log('Raw logs from file (allLogs):', allLogs);

    // Pass all logs to anomaly detection model (expects { time, type, uid })
    const anomalyResults = await modelController.detectLogsAnomaly(allLogs);
    console.log('anomlay results', anomalyResults)

    // Filter logs to last hour and keep the same structure
    const filteredLogs = anomalyResults
      .filter(log => {
        const logTime = new Date(log.time);
        return logTime >= new Date(defaultStart) && logTime <= new Date(end1);
      })
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10); // Default limit of 10

    if (res) {
      res.json({
        status: 'success',
        logs: filteredLogs,
        totalLogs: allLogs.length,
        filteredCount: filteredLogs.length
      });
    } else {
      console.log('Background fetch results:', {
        totalLogs: allLogs.length,
        filteredCount: filteredLogs.length,
        logs: filteredLogs
      });
    }
  } catch (error) {
    console.error('Error in fetchLokiDataFile:', error.message);
    if (res) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to process logs',
        error: error.message
      });
    }
  }
};


module.exports = {
  getAllDashboards,
  getDashboardrById,
  addDashboard,
  addDatasource,
  deleteDashboard,
  fetchLokiDataFile,

  prometheusToAnomalyDetection,
  getLokiLogs,
};