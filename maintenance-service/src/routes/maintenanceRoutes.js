const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceController");

// These routes will be prefixed with /maintenance
router.get("/", controller.getAll);  // You might need this
router.post("/", controller.schedule);
router.get("/upcoming", controller.getUpcoming);
router.patch("/:id/complete", controller.complete);

module.exports = router;