const mongoose = require("mongoose");

const User = require('./User')
const Datasource = require('./DataSource')


const userDatasourceSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'User' 
    },
    datasource_id: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'Datasource' 
    }
},
    { timestamps: true },
);

module.exports = mongoose.model("UserDatasource", userDatasourceSchema);