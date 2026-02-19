const ctx = document.getElementById("aqiChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "AQI Trend",
      data: [],
      borderColor: "#0078d7",
      borderWidth: 2,
      fill: false
    }]
  }
});

function getColor(aqi) {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 200) return "#ff7e00";
  if (aqi <= 300) return "#ff0000";
  return "#7e0023";
}

function getText(aqi) {
  if (aqi <= 50) return "GOOD";
  if (aqi <= 100) return "MODERATE";
  if (aqi <= 200) return "UNHEALTHY";
  if (aqi <= 300) return "VERY UNHEALTHY";
  return "HAZARDOUS";
}

async function fetchLatest() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    const aqi = data.overall || 0;

    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("aqiValue").style.color = getColor(aqi);
    document.getElementById("aqiText").innerText = getText(aqi);

    document.body.style.background = getColor(aqi) + "20";

    const pollutants = [
      {name:"PM2.5", val:data.pm25},
      {name:"PM10", val:data.pm10},
      {name:"CO", val:data.co},
      {name:"VOC", val:data.voc},
      {name:"SO2", val:data.so2},
      {name:"NO2", val:data.no2},
      {name:"NH3", val:data.nh3},
      {name:"Temp", val:data.temperature},
      {name:"Humidity", val:data.humidity}
    ];

    document.getElementById("cards").innerHTML =
      pollutants.map(p =>
        `<div class="card">
          <h3>${p.name}</h3>
          <h2>${p.val || 0}</h2>
        </div>`
      ).join("");

    document.getElementById("status").innerText = "Live Data";

  } catch {
    document.getElementById("status").innerText = "Connection Error";
  }
}

async function fetchHistory() {
  const res = await fetch("/api/history");
  const data = await res.json();

  chart.data.labels = data.map(d =>
    new Date(d.timestamp).toLocaleTimeString()
  );

  chart.data.datasets[0].data = data.map(d => d.overall);

  chart.update();
}

async function update() {
  await fetchLatest();
  await fetchHistory();
}

setInterval(update, 5000);
update();
