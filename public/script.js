//AQI COLOR 
function getAQIColor(aqi) {
  aqi = Number(aqi) || 0;

  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  if (aqi <= 400) return "#7c3aed";
  return "#6b21a8";
}

//  SAFE DOM UPDATE 
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerText = (value !== undefined && value !== null) ? value : "--";
}

//  CARD COLOR APPLY (FIXED) 
function setCardColor(id, value) {

  const valueEl = document.getElementById(id);
  if (!valueEl) return;

  const card = valueEl.closest(".sensor-card"); // 🔥 get full card
  if (!card) return;

  const color = getAQIColor(value);

  // Text styling
  valueEl.style.color = color;
  valueEl.style.fontWeight = "bold";

  //  FULL CARD STYLING
  card.style.borderLeft = `6px solid ${color}`;
  card.style.backgroundColor = color + "15"; // light background
  card.style.transition = "0.3s ease";
}

//  CHART SETUP 
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
    animation: { duration: 800 },
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
         min: 0,
         max: 100,
        title: { display: true, text: "AQI" }
      },
      x: {
        title: { display: true, text: "Time" }
      }
    }
  }
});

//  UPDATE UI 
function updateUI(data) {

  const aqi = data.aqi ?? 0;

  //  OVERALL AQI 
  setText("aqiValue", aqi);
  setText("aqiStatus", data.category ?? "-");

  const aqiCard = document.getElementById("aqiCard");
  if (aqiCard) {
    aqiCard.style.borderLeft = `10px solid ${getAQIColor(aqi)}`;
  }

  // SENSOR VALUES 
  setText("pm25", data.pm25_aqi);
  setText("pm10", data.pm10_aqi);

  setText("co", data.co_aqi);
  setText("voc", data.voc_aqi);
  setText("so2", data.so2_aqi);
  setText("no2", data.no2_aqi);

  setText("nh3", data.nh3_ppm);
  setText("alcoholAQI", data.alcohol_aqi);

  //  ENVIRONMENT 
  setText("temp", data.temp);
  setText("hum", data.hum); 
  setCardColor("pm25", data.pm25_aqi);
  setCardColor("pm10", data.pm10_aqi);
  setCardColor("co", data.co_aqi);
  setCardColor("voc", data.voc_aqi);
  setCardColor("so2", data.so2_aqi);
  setCardColor("no2", data.no2_aqi);
  setCardColor("alcoholAQI", data.alcohol_aqi);

  //  GRAPH 
  updateChart(aqi);
}

function updateChart(aqi) {

  const time = new Date().toLocaleTimeString();

  aqiChart.data.labels.push(time);
  aqiChart.data.datasets[0].data.push(aqi);

  if (aqiChart.data.labels.length > 20) {
    aqiChart.data.labels.shift();
    aqiChart.data.datasets[0].data.shift();
  }
  let maxAQI = Math.max(...aqiChart.data.datasets[0].data);

  let dynamicMax = 100;

  if (maxAQI > 80) dynamicMax = 150;
  if (maxAQI > 130) dynamicMax = 200;
  if (maxAQI > 180) dynamicMax = 250;
  if (maxAQI > 230) dynamicMax = 300;
  if (maxAQI > 280) dynamicMax = 400;
  if (maxAQI > 380) dynamicMax = 500;

  aqiChart.options.scales.y.max = dynamicMax;

  aqiChart.update();
}

// FETCH DATA 
async function fetchData() {

  try {
    const response = await fetch("/data");

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    updateUI(data);

  } catch (error) {
    console.error("Error fetching data:", error);

    setText("aqiValue", "--");
    setText("aqiStatus", "Disconnected");
  }
}

// ================= RUN =================
fetchData();
setInterval(fetchData, 2000);
