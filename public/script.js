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

    const aqi = data.aqi ?? 0;

    // ---------- OVERALL AQI ----------
    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("aqiStatus").innerText = data.category ?? "-";

    let color = getAQIColor(aqi);

    const card = document.getElementById("aqiCard");
    card.style.borderLeft = "10px solid " + color;

    // ---------- SENSOR VALUES (FIXED MAPPING) ----------
    // Now using AQI values instead of ppm (as per your system)

    document.getElementById("pm25").innerText = data.pm25 ?? 0;
    document.getElementById("pm10").innerText = data.pm10 ?? 0;

    document.getElementById("co").innerText = data.co ?? 0;
    document.getElementById("voc").innerText = data.voc ?? 0;
document.getElementById("so2").innerText = data.so2 ?? 0;
document.getElementById("no2").innerText = data.no2 ?? 0;

document.getElementById("nh3").innerText = data.nh3 ?? 0;;

    // Environmental
    document.getElementById("temp").innerText = data.temperature ?? 0;
    document.getElementById("hum").innerText = data.humidity ?? 0;

    // ---------- GRAPH UPDATE ----------
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

    // fallback display (no undefined)
    document.getElementById("aqiValue").innerText = "--";
  }
}

// ================= RUN =================
fetchData();
setInterval(fetchData, 20000);
