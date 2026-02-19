const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ service: "API Gateway", status: "running" });
});

// SIMPLE: Just forward everything with /machines prefix
app.use("/machines", createProxyMiddleware({
  target: "http://machine-service:4001",
  changeOrigin: true
}));

app.use("/maintenance", createProxyMiddleware({
  target: "http://maintenance-service:4002",
  changeOrigin: true
}));

app.listen(4000, () => console.log("Gateway running on port 4000"));