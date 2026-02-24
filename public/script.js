const aqiValue = document.getElementById("aqiValue");
const aqiStatus = document.getElementById("aqiStatus");

// Format helper
function formatNumber(value, decimals = 2) {
  return Number(value).toFixed(decimals);
}

// AQI Category
function getAQIStatus(aqi) {
  if (aqi <= 50) return { text: "GOOD", color: "#00e400" };
  if (aqi <= 100) return { text: "MODERATE", color: "#ffff00" };
  if (aqi <= 150) return { text: "UNHEALTHY (Sensitive)", color: "#ff7e00" };
  if (aqi <= 200) return { text: "UNHEALTHY", color: "#ff0000" };
  if (aqi <= 300) return { text: "VERY UNHEALTHY", color: "#8f3f97" };
  return { text: "HAZARDOUS", color: "#7e0023" };
}

// Fetch Latest Data
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();

    // 🔥 FIX: Round AQI
    const roundedAQI = Math.round(data.overall || 0);

    aqiValue.textContent = roundedAQI;

    const statusInfo = getAQIStatus(roundedAQI);
    aqiValue.style.color = statusInfo.color;
    aqiStatus.textContent = statusInfo.text;

    // Update parameter cards
    document.getElementById("pm25").textContent = formatNumber(data.pm25);
    document.getElementById("pm10").textContent = formatNumber(data.pm10);
    document.getElementById("co").textContent = formatNumber(data.co);
    document.getElementById("voc").textContent = formatNumber(data.voc);
    document.getElementById("so2").textContent = formatNumber(data.so2);
    document.getElementById("no2").textContent = formatNumber(data.no2);
    document.getElementById("nh3").textContent = formatNumber(data.nh3);
    document.getElementById("temperature").textContent = formatNumber(data.temperature, 1);
    document.getElementById("humidity").textContent = formatNumber(data.humidity, 0);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Auto refresh every 5 seconds
setInterval(fetchData, 5000);
fetchData();
