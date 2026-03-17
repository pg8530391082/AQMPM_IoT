// ================= AQI COLOR FUNCTION =================
function getAQIColor(aqi) {
  if (aqi <= 50) return "#22c55e";      // Green
  if (aqi <= 100) return "#eab308";     // Yellow
  if (aqi <= 200) return "#f97316";     // Orange
  if (aqi <= 300) return "#ef4444";     // Red
  if (aqi <= 400) return "#7c3aed";     // Purple
  return "#6b21a8";                     // Dark purple
}

// ================= CHART SETUP =================
const ctx = document.getElementById("aqiChart");

const aqiChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "AQI",
      data: [],
      borderColor: "#ff7b00",
      backgroundColor: "rgba(255,123,0,0.2)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 800
    },
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        min: 0,
        max: 500,
        title: {
          display: true,
          text: "AQI"
        }
      },
      x: {
        title: {
          display: true,
          text: "Time"
        }
      }
    }
  }
});

// ================= FETCH DATA =================
async function fetchData() {
  try {
    const response = await fetch("/data");
    const data = await response.json();

    const aqi = data.aqi;

    // ---------- OVERALL AQI ----------
    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("aqiStatus").innerText = data.category;

    let color = getAQIColor(aqi);

    const card = document.getElementById("aqiCard");
    card.style.borderLeft = "10px solid " + color;

    // ---------- SENSOR CARDS (AQI VALUES) ----------
    document.getElementById("pm25").innerText = data.aqi_pm25;
    document.getElementById("pm10").innerText = data.aqi_pm10;

    document.getElementById("co").innerText = data.aqi_co;
    document.getElementById("voc").innerText = data.aqi_voc;
    document.getElementById("so2").innerText = data.aqi_so2;
    document.getElementById("no2").innerText = data.aqi_no2;

    // NH3 (ppm)
    document.getElementById("nh3").innerText = data.nh3_ppm;

    // Environmental
    document.getElementById("temp").innerText = data.temperature;
    document.getElementById("hum").innerText = data.humidity;

    // ---------- GRAPH ----------
    let time = new Date().toLocaleTimeString();

    aqiChart.data.labels.push(time);
    aqiChart.data.datasets[0].data.push(aqi);

    if (aqiChart.data.labels.length > 20) {
      aqiChart.data.labels.shift();
      aqiChart.data.datasets[0].data.shift();
    }

    aqiChart.update();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// ================= START =================
fetchData();
setInterval(fetchData, 20000);
