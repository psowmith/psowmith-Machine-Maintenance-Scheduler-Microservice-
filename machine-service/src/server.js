require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/machines", require("./routes/machineRoutes"));

app.listen(4001, () => {
  console.log("Machine Service running on port 4001");
});
