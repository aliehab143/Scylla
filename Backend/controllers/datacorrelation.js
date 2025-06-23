const axios = require('axios');
const Datasource = require('../models/DataSource');
const DataCorrelation = require('../models/DataCorrelation');
const UserWorkflow = require('../models/UserWorkflow');
const { prometheusToAnomalyDetection, getLokiLogs } = require('./dashboard');
const { toUnixTimestamp, isUnixTimestamp } = require('../helpers/helper');


const createDataCorrelation = async (req, res) => {
    try {
        const { name, datasourceIds } = req.body;

        // Validate input
        if (!name || !Array.isArray(datasourceIds)) {
            return res.status(400).json({ error: 'Name and datasourceIds are required' });
        }

        // Check if all datasourceIds exist
        const datasources = await Datasource.find({ _id: { $in: datasourceIds } });
        if (datasources.length !== datasourceIds.length) {
            return res.status(400).json({ error: 'One or more DataSource IDs are invalid' });
        }
        console.log('datasourceids',datasources)
        // Create new DataCorrelation
        const dataCorrelation = new DataCorrelation({
            name,
            datasources: datasourceIds
        });

        await dataCorrelation.save();

        const user_id = req.user.id;
        // Find the user's workflow by their user ID
        const userworkflow = await UserWorkflow.findOne({ user_id });
        if (!userworkflow) {
            return res.status(404).json({ message: 'User workflow not found' });
        }
        console.log(...datasourceIds)
        // Add all datasource IDs to the user's workflow
        userworkflow.datacorrelations.push(dataCorrelation.id); 
        await userworkflow.save();

        res.status(201).json(dataCorrelation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getDataCorrelation = async (req, res) => {
    try {
        const dataCorrelation = await DataCorrelation.findById(req.params.id)
            .populate('datasources'); // Populates the referenced DataSources
        if (!dataCorrelation) {
            return res.status(404).json({ error: 'DataCorrelation not found' });
        }
        
        const { start, end, query, limit } = req.query;
        const correlationResults = [];
        
        // Iterate through each datasource in the correlation
        for (const datasource of dataCorrelation.datasources) {
            console.log(`Processing datasource: ${datasource.name} (${datasource.type})`);
            
            if (datasource.type === 'prometheus') {
                try {
                    // Set default time range if not provided
                    let startTime = start, endTime = end;
                    if (!startTime || !endTime) {
                        const now = new Date();
                        endTime = now.toISOString();
                        startTime = new Date(now - 0.5 * 60 * 60 * 1000).toISOString(); // 30 minutes ago
                    }
                    
                    // Convert to Unix timestamp if needed
                    let startUnix, endUnix;
                    if (!isUnixTimestamp(startTime)) {
                        startUnix = toUnixTimestamp(startTime);
                        endUnix = toUnixTimestamp(endTime);
                    } else {
                        startUnix = Number(startTime);
                        endUnix = Number(endTime);
                    }
                    
                    const prometheusData = await prometheusToAnomalyDetection(startUnix, endUnix, query, limit);
                    correlationResults.push({
                        data: prometheusData

                    });
                
                } catch (error) {
                    console.error(`Error processing Prometheus datasource ${datasource.name}:`, error);
                    correlationResults.push({
                        datasourceId: datasource._id,
                        datasourceName: datasource.name,
                        datasourceType: datasource.type,
                        error: error.message
                    });
                }
            } else if (datasource.type === 'loki') {
                try {
                    // Set default parameters for Loki
                    const now = new Date();
                    const endTime = end || now.toISOString();
                    const defaultStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
                    const startTime = start || defaultStart;
                    
                    const fetchParams = {
                        query: '{job="cloud-server-logs"}',
                        limit: parseInt(limit) || 30,
                        start: startTime,
                        end: endTime
                    };
                    

                    console.log('hosturl', datasource.hostURL)
                    const lokiLogs = await getLokiLogs(datasource.hostURL, fetchParams);
                    correlationResults.push({
                        logs: lokiLogs
                    });
                } catch (error) {
                    console.error(`Error processing Loki datasource ${datasource.name}:`, error);
                    correlationResults.push({
                        datasourceId: datasource._id,
                        datasourceName: datasource.name,
                        datasourceType: datasource.type,
                        error: error.message
                    });
                }
            } else {
                // Handle other datasource types or unknown types
                correlationResults.push({
                    datasourceId: datasource._id,
                    datasourceName: datasource.name,
                    datasourceType: datasource.type,
                    error: `Unsupported datasource type: ${datasource.type}`
                });
            }
        }

        console.log('Correlation results:', correlationResults);

        res.json({
            correlation: dataCorrelation,
            results: correlationResults
        });
    } catch (error) {
        console.error('Error in getDataCorrelation:', error);
        res.status(500).json({ error: error.message });
    }
}




module.exports = {
    createDataCorrelation,
    getDataCorrelation,

}