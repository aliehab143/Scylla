const mongoose = require('mongoose');

const userWorkflowSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User collection
    required: true,
    ref: 'User'
  },
  datasources: [
    { 
      type: mongoose.Schema.Types.ObjectId, ref:"Datasource" 
    }
  ],
  dashboards: [
    {
      type: mongoose.Schema.Types.ObjectId, ref:"Dashboard" 
    }
  ], 
  datacorrelations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataCorrelation' }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserWorkflow', userWorkflowSchema);
