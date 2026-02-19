require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/maintenance", require("./routes/maintenanceRoutes"));

app.listen(4002, () => {
  console.log("Maintenance Service running on port 4002");
});
