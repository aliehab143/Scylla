const mongoose = require("mongoose");

const csvSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    name: {type: String, required: true},
    type: {type: String, required: true},
    path: {type: String,required:true},
    uploadedAt: { type: Date, default: Date.now },

  },
);

module.exports = mongoose.model("Csv", csvSchema);