const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    datasource: 
        { 
          type: mongoose.Schema.Types.ObjectId,
          ref:"Datasource",
          required: true 
        }
      ,
    name: { type: String, required: true },
    widgets: [
      {
        widget_type: { type: String, required: true },
      },
    ],
  },
);

// dashboardSchema.index({ id: 1, uid: 1 }); 

module.exports = mongoose.model("Dashboard", dashboardSchema);