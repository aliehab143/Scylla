const axios = require('axios');
const Datasource = require('../models/DataSource');
const DataCorrelation = require('../models/DataCorrelation');
const UserWorkflow = require('../models/UserWorkflow');

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
        res.json(dataCorrelation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    createDataCorrelation,
    getDataCorrelation,

}