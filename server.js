const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const historyPath = path.join(__dirname, "data", "history.json");

let sensorData = {
  aqi: 0,
  category: "No Data",
  pm25_aqi: 0,
  pm10_aqi: 0,
  co_aqi: 0,
  voc_aqi: 0,
  so2_aqi: 0,
  no2_aqi: 0,
  alcohol_aqi: 0,
  nh3_ppm: 0,
  temp: 0,
  hum: 0,
  timestamp: "-"
};

/* ---------- Save History ---------- */
function saveHistory(data) {
  try {
    let history = [];

    if (fs.existsSync(historyPath)) {
      const file = fs.readFileSync(historyPath, "utf8");
      history = file ? JSON.parse(file) : [];
    }

    history.push(data);

    /* Keep only latest 10000 records */
    if (history.length > 10000) {
      history = history.slice(-10000);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (err) {
    console.log("❌ History save error:", err);
  }
}

/* ---------- Update Route ---------- */
app.post("/update", (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("❌ Empty data received");
    return res.status(400).json({ error: "No data received" });
  }

  sensorData = {
    ...sensorData,
    ...req.body,
    timestamp: new Date().toLocaleString()
  };

  console.log("✅ New Sensor Data:");
  console.log(sensorData);

  /* Ignore fake zero packets */
  if (
  sensorData.aqi > 0 &&
  sensorData.temp > 0 &&
  sensorData.hum >= 0
) {
    saveHistory({
      time: new Date().toISOString(),
      aqi: sensorData.aqi,
      category: sensorData.category,
      pm25: sensorData.pm25_aqi,
      pm10: sensorData.pm10_aqi,
      co: sensorData.co_aqi,
      voc: sensorData.voc_aqi,
      so2: sensorData.so2_aqi,
      no2: sensorData.no2_aqi,
      alcohol: sensorData.alcohol_aqi,
      nh3: sensorData.nh3_ppm,
      temp: sensorData.temp,
      hum: sensorData.hum
    });
  }

  res.json({ status: "received" });
});

/* ---------- Live Data ---------- */
app.get("/data", (req, res) => {
  res.json(sensorData);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
