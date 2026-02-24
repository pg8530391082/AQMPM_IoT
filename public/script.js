const aqiValue = document.getElementById("aqiValue");
const aqiText = document.getElementById("aqiText");
const statusBar = document.getElementById("status");
const cardsContainer = document.getElementById("cards");

let chart;
let chartData = [];

function getAQIInfo(aqi) {
  if (aqi <= 50) return { text: "GOOD", color: "#00e400" };
  if (aqi <= 100) return { text: "MODERATE", color: "#ffff00" };
  if (aqi <= 150) return { text: "UNHEALTHY (Sensitive)", color: "#ff7e00" };
  if (aqi <= 200) return { text: "UNHEALTHY", color: "#ff0000" };
  if (aqi <= 300) return { text: "VERY UNHEALTHY", color: "#8f3f97" };
  return { text: "HAZARDOUS", color: "#7e0023" };
}

async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();

    const roundedAQI = Math.round(data.overall || 0);

    // Update AQI number
    aqiValue.textContent = roundedAQI;

    // Update AQI status
    const info = getAQIInfo(roundedAQI);
    aqiValue.style.color = info.color;
    aqiText.textContent = info.text;

    // Update footer status
    statusBar.textContent = "Connected to server";

    // Update cards
    cardsContainer.innerHTML = `
      <div class="card">PM2.5<br>${data.pm25.toFixed(2)}</div>
      <div class="card">PM10<br>${data.pm10.toFixed(2)}</div>
      <div class="card">CO<br>${data.co.toFixed(2)}</div>
      <div class="card">VOC<br>${data.voc.toFixed(2)}</div>
      <div class="card">SO2<br>${data.so2.toFixed(2)}</div>
      <div class="card">NO2<br>${data.no2.toFixed(2)}</div>
      <div class="card">NH3<br>${data.nh3.toFixed(2)}</div>
      <div class="card">Temp<br>${data.temperature.toFixed(1)}</div>
      <div class="card">Humidity<br>${data.humidity.toFixed(0)}</div>
    `;

    updateChart(roundedAQI);

  } catch (error) {
    statusBar.textContent = "Connecting to server...";
    console.error(error);
  }
}

function initChart() {
  const ctx = document.getElementById("aqiChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "AQI Trend",
        data: [],
        borderColor: "#007bff",
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 300
        }
      }
    }
  });
}

function updateChart(aqi) {
  const now = new Date().toLocaleTimeString();

  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(aqi);

  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

initChart();
fetchData();
setInterval(fetchData, 5000);
