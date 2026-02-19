const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  task_id: { type: String, required: true, unique: true },
  machine_id: String,
  task_description: String,
  scheduled_date: Date,
  status: String,
  completed_on: Date
}, { versionKey: false });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
