const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const app = express();
const axios = require("axios");

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
app.get("/report", async (req, res) => {
  try {
    let history = [];

    if (fs.existsSync(historyPath)) {
      const file = fs.readFileSync(historyPath, "utf8");
      history = file ? JSON.parse(file) : [];
    }

    /* ---------------- CLEAN DATA ---------------- */
    history = history.filter(
      x => x.aqi > 0 && x.temp > 0 && x.hum >= 0
    );

    if (history.length === 0) {
      return res.status(404).send("No valid history data found.");
    }

    /* ---------------- LAST 7 DAYS ---------------- */
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - 7);

    const weekData = history.filter(
      x => new Date(x.time) >= cutoff
    );

    /* ---------------- SUMMARY ---------------- */
    const avgAQI =
      weekData.reduce((sum, x) => sum + x.aqi, 0) / weekData.length;

    const maxAQI = Math.max(...weekData.map(x => x.aqi));
    const minAQI = Math.min(...weekData.map(x => x.aqi));

    /* ---------------- DAILY AVG AQI ---------------- */
    const dailyMap = {};

    weekData.forEach(row => {
      const d = new Date(row.time).toLocaleDateString("en-GB");

      if (!dailyMap[d]) dailyMap[d] = [];
      dailyMap[d].push(row.aqi);
    });

    const dayLabels = Object.keys(dailyMap);
    const dayValues = dayLabels.map(
      d =>
        dailyMap[d].reduce((a, b) => a + b, 0) /
        dailyMap[d].length
    );

    /* ---------------- SAMPLE DATA ---------------- */
    const sample = weekData.filter((_, i) => i % 60 === 0);

    const tempScatter = sample.map(x => ({
      x: x.temp,
      y: x.aqi
    }));

    const humScatter = sample.map(x => ({
      x: x.hum,
      y: x.aqi
    }));

    /* ---------------- AQI > 70 ---------------- */
    const alerts = weekData.filter(x => x.aqi > 70).slice(-15);

    /* ---------------- CHART URLS ---------------- */

    const chart1 =
      "https://quickchart.io/chart?c=" +
      encodeURIComponent(JSON.stringify({
        type: "bar",
        data: {
          labels: dayLabels,
          datasets: [{
            label: "Avg AQI",
            data: dayValues
          }]
        }
      }));

    const chart2 =
      "https://quickchart.io/chart?c=" +
      encodeURIComponent(JSON.stringify({
        type: "scatter",
        data: {
          datasets: [{
            label: "Temp vs AQI",
            data: tempScatter
          }]
        }
      }));

    const chart3 =
      "https://quickchart.io/chart?c=" +
      encodeURIComponent(JSON.stringify({
        type: "scatter",
        data: {
          datasets: [{
            label: "Humidity vs AQI",
            data: humScatter
          }]
        }
      }));

    /* ---------------- PDF ---------------- */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AQI_Weekly_Report.pdf"
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    /* PAGE 1 */
    doc.fontSize(24).text("Air Quality Weekly Report", {
      align: "center"
    });

    doc.moveDown();
    doc.fontSize(14).text("Location: Sangli");
    doc.text("Generated: " + now.toLocaleString());

    doc.moveDown();
    doc.fontSize(18).text("Summary");

    doc.fontSize(13).text("Average AQI: " + avgAQI.toFixed(1));
    doc.text("Highest AQI: " + maxAQI);
    doc.text("Lowest AQI: " + minAQI);
    doc.text("Valid Records: " + weekData.length);

    /* PAGE 2 */
    doc.addPage();
    doc.fontSize(18).text("Average AQI vs Day");
    const img1 = await axios.get(chart1, { responseType: "arraybuffer" });
    doc.image(img1.data, { fit:[500,300], align:"center" });

    /* PAGE 3 */
    doc.addPage();
    doc.fontSize(18).text("AQI vs Temperature");
    doc.image(chart2, {
      fit: [500, 300],
      align: "center"
    });

    doc.moveDown();
    doc.fontSize(12).text(
      "Scatterplot shows measured AQI values across temperatures."
    );

    /* PAGE 4 */
    doc.addPage();
    doc.fontSize(18).text("AQI vs Humidity");
    doc.image(chart3, {
      fit: [500, 300],
      align: "center"
    });

    doc.moveDown();
    doc.fontSize(12).text(
      "Scatterplot shows measured AQI values across humidity."
    );

    /* PAGE 5 */
    doc.addPage();
    doc.fontSize(18).text("AQI Alerts (Above 70)");

    alerts.forEach(a => {
      doc.fontSize(12).text(
        `${new Date(a.time).toLocaleString()}  -> AQI ${a.aqi}`
      );
    });

    doc.end();

  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to generate report.");
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
