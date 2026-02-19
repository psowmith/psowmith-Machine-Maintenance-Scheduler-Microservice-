const Machine = require("../models/Machine");

exports.createMachine = async (req, res) => {
  const machine = await Machine.create(req.body);
  res.json(machine);
};

exports.getMachines = async (req, res) => {
  const machines = await Machine.find();
  res.json(machines);
};

exports.getMachine = async (req, res) => {
  // This uses MongoDB _id
  const machine = await Machine.findById(req.params.id);
  res.json(machine);
};

// FIXED VERSION - Use machine_id, not _id
exports.getMachineStatus = async (req, res) => {
  try {
    // FIND BY MACHINE_ID, not _id
    const machine = await Machine.findOne({ machine_id: req.params.id });
    
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    res.json({
      machine_id: machine.machine_id,
      name: machine.name,
      location: machine.location,
      status: machine.status,
      last_maintenance: machine.last_maintenance_date || "No record",
      maintenance_interval: machine.maintenance_interval_days
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};