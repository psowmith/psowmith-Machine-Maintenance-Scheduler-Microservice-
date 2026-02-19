const express = require("express");
const router = express.Router();
const controller = require("../controllers/machineController");

router.post("/", controller.createMachine);
router.get("/", controller.getMachines);
router.get("/:id", controller.getMachine);
router.get("/:id/status", controller.getMachineStatus);
router.get("/by-machine-id/:machine_id", async (req, res) => {
  const Machine = require("../models/Machine");
  const machine = await Machine.findOne({ machine_id: req.params.machine_id });
  res.json(machine);
});

module.exports = router;
