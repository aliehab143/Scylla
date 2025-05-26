const User = require('../models/User');
const UserWorkflow = require('../models/UserWorkflow');
const mongoose = require('mongoose');

const getAllDatasources = async (req, res) => {
    const userId = req.user.id
    console.log("user id ", userId);

    const data = await UserWorkflow.find({
        user_id: userId
    })
        .populate('datasources')
        .populate('dashboards');
    console.log(data);

    res.json({ data })

}

const addDatasource = async (req, res) => {
    try {

        const user_id = req.user.id;
        const datasource_id = req.params.id;

        const userworkflow = await UserWorkflow.findOne({ user_id })
        userworkflow.datasources.push(datasource_id);
        await userworkflow.save();
        res.json("Datasource added successfuly");
    } catch (error) {
        console.error("Error adding datasource:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
// const userId = req.user.id; // Get user ID from the request
// const { name, type, connection_details } = req.body; // Get new datasource details from the request body

// const datasouceId = req.params.id;

// // Validate required fields
// if (!name || !type || !connection_details) {
//     return res.status(400).json({ message: "Missing datasource details." });
// }

// // Convert userId to ObjectId
// const objectId = new mongoose.Types.ObjectId(userId);

// // Update the document by adding a new datasource
// const updatedWorkflow = await UserWorkflow.findOneAndUpdate(
//     { user_id: objectId },
//     {
//         $push: {
//             datasources: datasouceId,
//         },
//     },
//     { new: true } // Return the updated document
// );

// if (!updatedWorkflow) {
//     return res.status(404).json({ message: "UserWorkflow not found for the provided user ID." });
// }

// res.json({ message: "Datasource added successfully.", data: updatedWorkflow });

const addDashboard = async (req, res) => {
    try {

        const user_id = req.user.id;
        const dashboard_id = req.params.id;
        console.log("dashboard id", dashboard_id)

        const userworkflow = await UserWorkflow.findOne({ user_id })
        userworkflow.dashboards.push(dashboard_id);

        console.log('dashboards', userworkflow.dashboards);
        await userworkflow.save();
        res.json({ data: "Dashboard is added sucessfully" });
    } catch (error) {
        console.error("Error adding dashboard:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



// not applicable
const getDatasourceById = async (req, res) => {

    try {
        const user_id = req.user.id
        const datasourceId = req.params.id


        // const workflow = await UserWorkflow.findOne({
        //     'datasources._id': datasourceId,
        // }).select(['datasources'])

        const workflow = await UserWorkflow.findOne({ user_id }).populate('datasources')
        console.log("datasource is  ", workflow)
        // const data = workflow.datasources.findById({ datasourceId });

        res.json({ workflow });

    } catch (error) {
        res.json(error)
    }
}

// not applicable 
const getDashboardById = async (req, res) => {

    try {
        const userId = req.user.id
        const dashboardId = req.params.id

        const workflow = await UserWorkflow.findOne({
            'dashboards._id': dashboardId,
        }).select(['dashboards'])

        console.log("dashboard is  ", workflow)
        const data = workflow.dashboards;
        res.json(data);

    } catch (error) {
        res.json({ msg: error })
    }
}

const updateDashboard = async (req, res) => {
    const userId = req.user.id
    const dashboardId = req.params.id

    const workflow = UserWorkflow.findOne({
        user_id: userId
    })


}


module.exports = {
    getAllDatasources,
    addDatasource,
    addDashboard,
    getDashboardById,
    getDatasourceById,
}