const Maintenance = require("../models/Maintenance");
const axios = require("axios");

exports.schedule = async (req, res) => {
  try {
    const { task_id, machine_id, task_description, scheduled_date, status, completed_on } = req.body;

    const newTask = new Maintenance({
      task_id,
      machine_id,
      task_description,
      scheduled_date,
      status,
      completed_on
    });

    await newTask.save();

    res.status(201).json(newTask);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcoming = async (req, res) => {
  const today = new Date();
  const upcoming = await Maintenance.find({
    scheduledDate: { $gte: today },
    status: "SCHEDULED"
  });
  res.json(upcoming);
};

exports.complete = async (req, res) => {
  const task = await Maintenance.findById(req.params.id);
  task.status = "COMPLETED";
  task.completedDate = new Date();
  await task.save();

  res.json(task);
};

// Add this new function
exports.getAll = async (req, res) => {
  try {
    const tasks = await Maintenance.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};