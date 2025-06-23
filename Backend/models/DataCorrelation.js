const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataCorrelationSchema = new Schema({
    
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true 
    },
    datasources: [{
      type: Schema.Types.ObjectId,
      ref: 'Datasource' 
    }]
  }, {
    timestamps: true 
  });

  
module.exports = mongoose.model('DataCorrelation', DataCorrelationSchema);