const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  machine_id: { type: String, required: true, unique: true },
  name: String,
  location: String,
  last_maintenance_date: Date,
  maintenance_interval_days: Number,
  status: String
}, { versionKey: false });

module.exports = mongoose.model("Machine", machineSchema);
