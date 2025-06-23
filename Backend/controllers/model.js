const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Dashboard = require("../models/Dashboard");
const { consoleLogger } = require('@influxdata/influxdb-client');


// old 1st semester model
const detect = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the dashboard and associated datasource
    const dashboard = await Dashboard.findById(id).populate('datasource');
    if (!dashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    const { datasource } = dashboard;

    // Ensure datasource type is CSV
    if (datasource.type !== "csv") {
      return res.status(400).json({ error: "Datasource type must be CSV" });
    }

    // Construct the file path
    const filePath = path.join(__dirname, `../${datasource.path}`);
    console.log('File path:', filePath);

    // Ensure the file exists before attempting to read it
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Prepare the form data for the request
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    console.log('Form data prepared.');

    // Make the request to the Flask application
    const response = await axios.post(
      "http://127.0.0.1:5000/test-csv",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log('Response data:', response.data);
    const data = response.data;
    res.json({ data });

  } catch (error) {
    console.error('Error in detect function:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const anomlay = async (req, res) => {
  const data = await axios.get('http://localhost:5000/anomaly');
  console.log('data is ', data)
  res.json(data.data)

}


const detectTempAnomaly = async (req, res) => {
  try {
    const {data} = req.body
    console.log('data is ',data)
    const response = await axios.post('http://localhost:5005/detect_anomalies',data);
    console.log(response)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
    
    
  }
}

const detectCpuAnomaly = async (values) => {
  try {
  
    const metrics = { values }

    const response = await axios.post(process.env.CPU_ANOMALY_DETECTOR_URL,
      metrics,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
    return response.data;

  } catch (error) {
    console.log('error message is ',error.message)
    const  message  = error.message; 
    return message;
    
    
  }
}

const detectLogsAnomaly = async (logs) => {
  // 127.0.0.1:5007
  try {
    const response = await axios.post('http://127.0.0.1:5007/detect_anomalies',logs)
    const data = response.data;
    return data
    

  } catch (error) {
    const { message } = error.message; 
    return {message};
    
  }
}

const detectLogsAnomalyCSV = async(req, res) => {
  try {
  
 const { id } = req.params;
console.log('id is ', id) 
    // Fetch the dashboard and associated datasource
    const dashboard = await Dashboard.findById(id).populate('datasource');
    if (!dashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    const { datasource } = dashboard;

    // Ensure datasource type is CSV
    if (datasource.type !== "csv") {
      return res.status(400).json({ error: "Datasource type must be CSV" });
    }

    const dashboardId = req.params.id;


    // Construct the file path
    const filePath = path.join(__dirname, `../${datasource.path}`);
    console.log('File path:', filePath);

    // Ensure the file exists before attempting to read it
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Prepare the form data for the request
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    console.log('Form data prepared.');

    // Make the request to the Flask application
    const response = await axios.post(
      "http://localhost:5007/detect_anomalies",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log('Response data:', response.data);
    const data = response.data;
    res.json({ data });

  } catch (error) {
    
  }
}

module.exports = { 
  detect, 
  anomlay ,
  detectTempAnomaly,
  detectCpuAnomaly,
  detectLogsAnomaly,
  detectLogsAnomalyCSV,

  
};
