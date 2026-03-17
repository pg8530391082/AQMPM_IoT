function getAQIColor(aqi) {
  if (aqi <= 50) return "#22c55e";      // Green
  if (aqi <= 100) return "#eab308";     // Yellow
  if (aqi <= 200) return "#f97316";     // Orange
  if (aqi <= 300) return "#ef4444";     // Red
  if (aqi <= 400) return "#7c3aed";     // Purple
  return "#6b21a8";                     // Dark purple
}

// Chart Setup
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

// Fetch Data
async function fetchData() {
  try {
    const response = await fetch("/data");
    const data = await response.json();

    const aqi = data.aqi;

    // Update AQI display
    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("aqiStatus").innerText = data.category;

    let color = getAQIColor(aqi);

    // Update AQI card style
    const card = document.getElementById("aqiCard");
    card.style.borderLeft = "10px solid " + color;

    // Sensor values
    document.getElementById("pm25").innerText = data.pm25;
    document.getElementById("pm10").innerText = data.pm10;
    document.getElementById("co").innerText = data.co;
    document.getElementById("voc").innerText = data.voc;
    document.getElementById("so2").innerText = data.so2;
    document.getElementById("no2").innerText = data.no2;
    document.getElementById("nh3").innerText = data.nh3;
    document.getElementById("temp").innerText = data.temperature;
    document.getElementById("hum").innerText = data.humidity;

    // Graph update
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

// Initial + Interval
fetchData();
setInterval(fetchData, 20000);
