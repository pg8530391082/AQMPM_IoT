/* ---------------- AQI CATEGORY LOGIC ---------------- */

function getAQICategory(aqi){

if(aqi <= 50) return ["Good","good"]
if(aqi <= 100) return ["Satisfactory","satisfactory"]
if(aqi <= 200) return ["Moderate","moderate"]
if(aqi <= 300) return ["Poor","poor"]
if(aqi <= 400) return ["Very Poor","verypoor"]
return ["Severe","severe"]

}


/* ---------------- UPDATE SENSOR CARD ---------------- */

function updateCard(id,value){

let [label,css] = getAQICategory(value)

document.getElementById(id).innerText = value
document.getElementById(id+"Status").innerText = label

let card = document.getElementById("card-"+id)
card.className = "sensor-card " + css

}


/* ---------------- CHART VARIABLES ---------------- */

let aqiChart
let tempChart
let humidityChart
let weeklyChart


/* ---------------- INITIALIZE CHARTS ---------------- */

function initCharts(){

/* AQI CHART */

const aqiCtx = document.getElementById("aqiChart").getContext("2d")

const aqiGradient = aqiCtx.createLinearGradient(0,0,0,300)
aqiGradient.addColorStop(0,"rgba(255,140,0,0.6)")
aqiGradient.addColorStop(1,"rgba(255,140,0,0)")

aqiChart = new Chart(aqiCtx,{

type:"line",

data:{
labels:[],
datasets:[{
label:"AQI Index",
data:[],
borderColor:"#ff8c00",
backgroundColor:aqiGradient,
fill:true,
tension:0.4
}]
},

options:{
responsive:true,
scales:{
x:{
title:{
display:true,
text:"Time"
}
},
y:{
title:{
display:true,
text:"AQI"
}
}
}
}

})



/* TEMPERATURE CHART */

const tempCtx = document.getElementById("tempChart").getContext("2d")

const tempGradient = tempCtx.createLinearGradient(0,0,0,300)
tempGradient.addColorStop(0,"rgba(255,99,132,0.6)")
tempGradient.addColorStop(1,"rgba(255,99,132,0)")

tempChart = new Chart(tempCtx,{

type:"line",

data:{
labels:[],
datasets:[{
label:"Temperature (°C)",
data:[],
borderColor:"#ff4d6d",
backgroundColor:tempGradient,
fill:true,
tension:0.4
}]
},

options:{
scales:{
x:{title:{display:true,text:"Time"}},
y:{title:{display:true,text:"Temperature"}}
}
}

})



/* HUMIDITY CHART */

const humCtx = document.getElementById("humidityChart").getContext("2d")

const humGradient = humCtx.createLinearGradient(0,0,0,300)
humGradient.addColorStop(0,"rgba(54,162,235,0.6)")
humGradient.addColorStop(1,"rgba(54,162,235,0)")

humidityChart = new Chart(humCtx,{

type:"line",

data:{
labels:[],
datasets:[{
label:"Humidity (%)",
data:[],
borderColor:"#36a2eb",
backgroundColor:humGradient,
fill:true,
tension:0.4
}]
},

options:{
scales:{
x:{title:{display:true,text:"Time"}},
y:{title:{display:true,text:"Humidity"}}
}
}

})



/* WEEKLY AQI BAR CHART */

weeklyChart = new Chart(document.getElementById("aqiDayChart"),{

type:"bar",

data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[{
label:"Weekly AQI",
data:[0,0,0,0,0,0,0],
backgroundColor:[
"#4CAF50",
"#8BC34A",
"#FFC107",
"#FF9800",
"#F44336",
"#9C27B0",
"#673AB7"
]
}]
},

options:{
scales:{
x:{title:{display:true,text:"Day"}},
y:{title:{display:true,text:"AQI"}}
}
}

})

}

initCharts()


/* ---------------- UPDATE GRAPH DATA ---------------- */

function updateCharts(time,aqi,temp,humidity){

aqiChart.data.labels.push(time)
aqiChart.data.datasets[0].data.push(aqi)

tempChart.data.labels.push(time)
tempChart.data.datasets[0].data.push(temp)

humidityChart.data.labels.push(time)
humidityChart.data.datasets[0].data.push(humidity)

/* Limit to last 20 points */

if(aqiChart.data.labels.length > 20){

aqiChart.data.labels.shift()
aqiChart.data.datasets[0].data.shift()

tempChart.data.labels.shift()
tempChart.data.datasets[0].data.shift()

humidityChart.data.labels.shift()
humidityChart.data.datasets[0].data.shift()

}

aqiChart.update()
tempChart.update()
humidityChart.update()

}


/* ---------------- FETCH SENSOR DATA ---------------- */

async function fetchData(){

try{

const response = await fetch("/data")
const data = await response.json()

updateCard("pm25",data.pm25)
updateCard("pm10",data.pm10)
updateCard("co",data.co)
updateCard("voc",data.voc)
updateCard("so2",data.so2)
updateCard("no2",data.no2)
updateCard("nh3",data.nh3)

document.getElementById("temp").innerText = data.temperature
document.getElementById("humidity").innerText = data.humidity

const time = new Date().toLocaleTimeString()

updateCharts(time,data.aqi,data.temperature,data.humidity)

}
catch(error){

console.log("Data fetch error:",error)

}

}


/* ---------------- AUTO UPDATE ---------------- */

fetchData()

setInterval(fetchData,20000)
