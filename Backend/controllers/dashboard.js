require('dotenv').config();
const axios = require('axios');
// const grafana_url = "http://localhost:3000";
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



const getDashboardrById = async (req, res) => {
  try {
    const dashboard_id = req.params.uid;
    const data = await dashboard.findById({ _id: dashboard_id }).populate('datasource');
    const results = [];
    
    console.log('host url  is ', data.datasource.hostURL)


    if (data.datasource.type === 'csv') {
      const user_id = req.user.id;
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

      const user_id = req.user.id;

      const { query, start, end, step } = req.query;
      // an earlier start for the model to detect detection
      
      const earlierstart = Math.floor(parseFloat(start)) - 5 * 60 * 60; // Subtract 5 hours in seconds
      const newstart = earlierstart.toString();
      console.log(`new start is ${newstart} end is ${end} original start ${start}`)
      
      // Convert start and end to ISO format
      const startFormatted = new Date(Math.floor(parseFloat(start)) * 1000).toISOString().slice(0, 19);
      const endFormatted = new Date(Math.floor(parseFloat(end)) * 1000).toISOString().slice(0, 19);

      const prometheusResponse = await axios.get(`${data.datasource.hostURL}/api/v1/query_range`, {
        params: { query, start, end, step:14 }
      });
      
      // Log the full URL from the request config
      console.log('Full URL:', prometheusResponse.config.url + '?' + new URLSearchParams(prometheusResponse.config.params).toString());
      // console.log('prometheus',prometheusResponse)

      if (!prometheusResponse.data || !prometheusResponse.data.data) {
        return res.status(400).json({ message: 'Invalid response from Prometheus API.' });
      }
      
      const result = prometheusResponse.data.data.result;
      // console.log('reselt',result)

      // console.log('result is ', temp); // Log the values of the second result (if exists)

      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No data returned for the selected metric.' });
      }

      
      const timeSeriesData = result.flatMap((series) =>
        series.values.map(([timestamp, value]) => ({
          time: new Date(Math.floor(parseFloat(timestamp)) * 1000).toISOString().slice(0, 19),
          value: parseFloat(value),
        }))
      );

      
      // console.log('Prometheus data:', timeSeriesData);

      const modelInput = timeSeriesData;

      // console.log('hamada 1 ')
      // console.log('model input is ', JSON.stringify(modelInput))
      // console.log('hamada 2 ')

      // Record start time
      const startTime = performance.now();

      const modelResponse = await modelController.detectCpuAnomaly(modelInput);
      // Record end time
      const endTime = performance.now();

      // Calculate duration in milliseconds
      const durationMs = endTime - startTime;
      console.log('time of await is ', durationMs)
      // console.log('model response is ', modelResponse)


      // filter to find orginal data 
      const filteredModelResponse = modelResponse.filter((item) => {
        // console.log('item is ',item)
        // console.log('startformatted is ', startFormatted, 'end formatted is ', endFormatted);
        const itemTime = new Date(item.time);
        const startTime = new Date(startFormatted);
        const endTime = new Date(endFormatted);
        return itemTime >= startTime && itemTime <= endTime;
      });

      // console.log('final data', filteredModelResponse);

      // format time from 2025-04-09T04:12:27 to 7:52:46 PM
      const filteredModelResponseFormatted = filteredModelResponse.map((item) => ({
        anomaly: item.anomaly,
        time: new Date(item.time).toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        }),
        value: item.value
      }));

      infoLog(user_id, 'get_dashboard_prometheus', dashboard_id);
      // console.log('Filtered model response formatted:', filteredModelResponseFormatted);
        // 8. Return results
        return res.json({
          data: modelResponse,
          message: 'CPU data processed and searched',
          // data: searchResults
        });
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

        const user_id = req.user.id;

        // if no params return logs from last 1 hr
        const now = new Date();
        const end1 = now.toISOString();
        // Set a predefined early start time (e.g., 7 days ago)
        const defaultStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

        const { query, limit, start, end } = req.query;

        // Parameters for fetching large dataset from Loki
        const fetchParams = {
          query: query || '{job="express_logs"}',
          limit: parseInt(limit) || 10, // Increased limit for broader data
          start: defaultStart, // Use early start time for broad data fetch
          end: end1
        };

        const response = await axios.get(`${data.datasource.hostURL}/loki/api/v1/query_range`, { params: fetchParams });
        
        const { data: { data: { result } } } = response;
        console.log('result is ', result)

        // Flatten all log values from all streams


        const logs = result.flatMap(({ values }) =>
          values.map(([timestamp, logLine]) => ({
            timestamp,
            log: JSON.parse(logLine.trim()) // assuming logLine is JSON
          }))
        );
    

        infoLog(user_id, 'get_dashboard_loki', dashboard_id);
        return res.json(logs)
        
        // get logs from file
      // console.log(__dirname)
      //   const logFilePath = path.join(__dirname, '..', 'GenerateLogsServer','logs', 'app.log');
      // console.log('Reading logs from:', logFilePath);

      // // Read and parse logs from file (allLogs matches app.log structure)
      // const allLogs = await parseLogFile(logFilePath);


      // res.json({data: allLogs})



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





const getLokiLogs = async (req, res) => {
  try {

    // last 1 hr
    const now = new Date();
    const end1 = now.toISOString();
    const start1 = new Date(now - 60 * 60 * 1000).toISOString();


    const dashboard_id = req.params.uid;
    const data = await Dashboard.findById({ _id: dashboard_id }).populate('datasource');


    const { query, limit, start, end } = req.query;

    const params = {
      query: query || '{job="express_logs"}',
      limit: parseInt(limit) || 10,
      start: start || start1,
      end: end || end1
    };

    // Normalize the base URL by removing trailing slashes
    const baseUrl = data.datasource.hostURL.replace(/\/+$/, '');
    const url = `${baseUrl}/loki/api/v1/query_range`;

    console.log('Requesting URL:', url, 'with params:', params); // For debugging

    const response = await axios.get(url, { params });
    console.log('response', response)


    // Parse and format logs
    const logs = response.data.data.result.flatMap(stream =>
      stream.values.map(([timestamp, line]) => {
        let parsedLine = {};
        try {
          if (typeof line === 'string' && line.trim()) {
            parsedLine = JSON.parse(line);
          } else {
            parsedLine.raw = line || '';
          }
        } catch (e) {
          parsedLine.raw = line;
        }

        return {
          logTimestamp: new Date(parseInt(timestamp) / 1000000).toISOString(),
          level: parsedLine.level || 'unknown',
          message: parsedLine.message || (parsedLine.raw !== undefined ? parsedLine.raw : ''),
          method: parsedLine.method || 'N/A',
          requestTimestamp: parsedLine.timestamp || 'N/A',
          url: parsedLine.url || 'N/A'
        };
      })
    );

    const sortedLogs = logs.sort((a, b) => new Date(b.logTimestamp) - new Date(a.logTimestamp)).slice(0, params.limit);

    res.json({
      status: 'success',
      logs: sortedLogs,
    });


  } catch (error) {
    console.error('Error fetching logs from Loki:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch logs',
      error: error.message
    });
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
    const logFilePath = path.join(__dirname, '..', 'Generate logs Server','logs', 'app.log');
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
  getLokiLogs,
  fetchLokiDataFile,

};