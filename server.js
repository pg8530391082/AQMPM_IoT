const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Latest data
let latestData = {
  pm25: 0,
  pm10: 0,
  co: 0,
  alcohol: 0,
  voc: 0,
  so2: 0,
  no2: 0,
  nh3: 0,
  overall: 0,
  temperature: 0,
  humidity: 0,
  timestamp: Date.now(),
  status: "Waiting for sensor data..."
};

// History storage (last 50 records)
let history = [];

// POST - ESP32 sends data
app.post("/api/data", (req, res) => {
  const data = req.body;

  latestData = {
    pm25: data.pm25 || 0,
    pm10: data.pm10 || 0,
    co: data.co || 0,
    alcohol: data.alcohol || 0,
    voc: data.voc || 0,
    so2: data.so2 || 0,
    no2: data.no2 || 0,
    nh3: data.nh3 || 0,
    overall: data.overall || data.aqi || 0,
    temperature: data.temperature || 0,
    humidity: data.humidity || 0,
    timestamp: Date.now(),
    status: "Live Data"
  };

  history.push(latestData);

  if (history.length > 50) {
    history.shift();
  }

  console.log("📡 New Data:", latestData.overall);

  res.json({ status: "success" });
});

// GET - Latest data for frontend
app.get("/api/data", (req, res) => {
  res.json(latestData);
});

// GET - History for graph
app.get("/api/history", (req, res) => {
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`🚀 AQMPM Server running on port ${PORT}`);
});
