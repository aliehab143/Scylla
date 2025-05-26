const axios = require('axios');
const grafanaAPI = require('../api/grafanaAPI');
const csv = require('../models/CSV');
const user_datasource = require('../models/UserDataSource');
const datasource = require('../models/DataSource');
const UserWorkflow = require('../models/UserWorkflow');
const promethus = require('../api/promethus');
const DataSource = require('../models/DataSource');
const dashboard = require('../models/Dashboard');
const { infoLog, errorLog } = require('../logger');

const LOKI_URL = 'http://localhost:3100/loki/api/v1/push';


// get all datasources from grafana
const getAllDatasourcesDeprycated = async (req, res) => {
  try {

    const response = await grafanaAPI.get('/api/datasources');
    const csvsFromDatabase = await csv.find().select(['_id', 'filename']);

    const csvs = csvsFromDatabase.map(csv => {
      return {
        ...csv._doc,
        name: csv.filename,
        type: "csv"
      }

    })


    const dataSource = response.data.map(dataSource => {
      return {
        ...dataSource, // spread operator to retain other properties
        typeLogoURL: `/${dataSource.type.toLowerCase()}.png`,
        jsonData: ""

      };
    });

    const data = [...csvs, ...dataSource]
    res.json(data);
  } catch (error) {
    console.error("Error fetching datasources:", error);
    res.status(500).json({ msg: error });
  }
};

const getDatasourceById = async (req, res) => {
  try {
    
    const datasourceId = req.params.id;
    const data = await datasource.findById({ _id: datasourceId });

    if (!data) {
      return res.status(404).json({ error: 'Datasource not found.' });
    }
    
    res.json( data );
  } catch (error) {
    console.error('Error fetching datasource:', error.message);
    res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};


const uploadCSV = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    // Return the uploaded file info as JSON
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }


    const savedDatasource = await datasource.create({
      filename: req.file.filename,
      name: req.body.filename,
      type: "csv",
      path: req.file.path,
    });

    const datasource_id = savedDatasource._id;

    const userworkflow = await UserWorkflow.findOne({ user_id })

    userworkflow.datasources.push(datasource_id);
    await userworkflow.save();

    infoLog(user_id, 'upload_csv', datasource_id);
    
    res.json(savedDatasource);

  } catch (error) {

    errorLog(user_id, 'failed_upload_csv', error.message);

    return res.status(500).json({ message: error.message });
    // next(error);
  }
};

// post Datasource --> grafana
// add Datasource --> mongo
// add ds is addDatasource ---> mongo
const addDatasource = async (req, res) => { 
  try {
    const { hostURL, type } = req.body;
    // Validate Prometheus host URL
    if (type === 'prometheus') {
      try {
        const testResponse = await axios.get(`${hostURL}/api/v1/status/buildinfo`);
        if (testResponse.status !== 200) {
          return res.status(400).json({ message: 'Invalid Prometheus host URL' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Failed to connect to the Prometheus server. Please check the host URL.' });
      }
    }

    // Validate loki host URL
    if (type === 'loki') {
      try {
        const testResponse = await axios.get(`${hostURL}/metrics`);
        if (testResponse.status !== 200) {
          return res.status(400).json({ message: 'Invalid Prometheus host URL' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Failed to connect to the Loki server. Please check the host URL.' });
      }
    }

    const user_id = req.user.id; // Extract the user ID from the request object
    

    // Create a new datasource record in the database
    const savedDatasource = await datasource.create(req.body);
    const datasourceId = savedDatasource._id;

    // Find the user's workflow by their user ID
    const userworkflow = await UserWorkflow.findOne( {user_id} );
    console.log('userworkflow',userworkflow)


    if (!userworkflow) {
      return res.status(404).json({ message: 'User workflow not found' });
    }

    // Add the new datasource ID to the user's workflow
    userworkflow.datasources.push(datasourceId);
    await userworkflow.save();
    
    
    infoLog(user_id, 'add_datasource', datasourceId);

    res.json(savedDatasource);

    
  } catch (error) {

    errorLog(user_id, 'failed_add_datasource', error.message);

    res.status(500).json({ message: error.message });
  }
};


const getPrometheusMetrics = async (req, res) => {
  try {
    console.log(req.params.id)
    // Fix: Removed unnecessary curly braces around _id and added proper query syntax
    const source = await dashboard.findById(req.params.id).populate('datasource');
    console.log(source);
    
    if (!source || !source.datasource) {
      return res.status(404).json({ message: 'Dashboard or datasource not found' });
    }
    
    // Fix: Added template literal syntax with backticks
    const response = await axios.get(`${source.datasource.hostURL}/api/v1/label/__name__/values`);
    console.log(response);
    
    const data = response.data.data;

    res.json({ data }); // 'data' is already defined, no need to rename it
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};




const getLokiQueries = async (req,res) => {
  try {
    const hostURL = "http://localhost:3100";
    const response = await axios.get(`${hostURL}/api/v1/label/__name__/values`);
    console.log(response)
    const data = response.data.data;
    res.json({data}); 
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
    
  }

};


const deleteDatasource = async (req, res) => {
  try {
    const datasourceId = req.params.id;
    const user_id = req.user.id;

    // Find the user's workflow
    const userWorkflow = await UserWorkflow.findOne({ user_id: user_id });
    if (!userWorkflow) {
      return res.status(404).json({ message: 'User workflow not found' });
    }

    // Check if the datasource belongs to the user
    const datasourceIndex = userWorkflow.datasources.indexOf(datasourceId);
    if (datasourceIndex === -1) {
      return res.status(404).json({ message: 'Datasource not found for this user' });
    }

    // Remove the datasource from the user's workflow
    userWorkflow.datasources.splice(datasourceIndex, 1);
    await userWorkflow.save();

    // Delete the datasource document
    const deletedDatasource = await datasource.findByIdAndDelete(datasourceId);
    if (!deletedDatasource) {
      return res.status(404).json({ message: 'Datasource not found' });
    }

    // If it's a CSV datasource, also delete the file
    if (deletedDatasource.type === 'csv' && deletedDatasource.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(deletedDatasource.path);
      } catch (err) {
        console.error('Error deleting CSV file:', err);
      }
    }

    infoLog(user_id, 'delete_datasource', datasourceId);

    return res.json({ message: 'Datasource deleted successfully' });
  } catch (error) {

    errorLog(user_id, 'failed_delete_datasource', error.message);

    return res.status(500).json({ message: 'Error deleting datasource', error: error.message });
  }
};


const updateDatasource = async (req , res) =>{
  try {
      const updatedProduct = await DataSource.findByIdAndUpdate(
          {_id:req.params.id},
          {$set:req.body},
          {new:true}
      );

      infoLog(user_id, 'update_datasource', req.params.id);

      return res.status(201).json(updatedProduct)
  } catch (error) {

      errorLog(user_id, 'failed_update_datasource', error.message);

      return res.status(500).json({msg:error})
  }
}



// Send log to Loki
async function sendToLoki(logData) {
  try {
    const response = await axios.post(LOKI_URL, logData, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 204) {
      console.log(`Log sent successfully at ${new Date().toISOString()}: ${JSON.stringify(logData.streams[0].values[0])}`);
    }
  } catch (error) {
    console.error('Failed to send log:', error.response ? error.response.data : error.message);
  }
}




module.exports = {

  uploadCSV,
  addDatasource,
  getDatasourceById,
  deleteDatasource,
  updateDatasource,
  sendToLoki,
  getPrometheusMetrics,

};
