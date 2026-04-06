const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


let sensorData = {
  aqi: 0,
  category: "No Data",
  pm25: 0,
  pm10: 0,
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

  res.json({ status: "received" });
});


app.get("/data", (req, res) => {
  res.json(sensorData);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
