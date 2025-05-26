const mongoose = require("mongoose");

const datasourceSchema = new mongoose.Schema(
  {
    // id: { type: mongoose.Types.ObjectId, required: true },
    // uid: { type: String, required: true }, 
    name: {type: String, required: true},
    filename: {type: String},
    type: {type: String, required: true},
    path: {type: String},
    hostURL: {type: String},
    uploadedAt: { type: Date },
  },
);

// datasourceSchema.index({ id: 1, uid: 1 });  // Create an ascending index on both fields

module.exports = mongoose.model("Datasource", datasourceSchema);