function getAQIColor(aqi){

if(aqi<=50) return "#22c55e"
if(aqi<=100) return "#eab308"
if(aqi<=200) return "#f97316"
if(aqi<=300) return "#ef4444"
if(aqi<=400) return "#7c3aed"

return "#6b21a8"

}


const aqiChart = new Chart(

document.getElementById("aqiChart"),

{

type:"line",

data:{
labels:[],
datasets:[{
label:"AQI",
data:[],
borderColor:"#ff7b00",
backgroundColor:"rgba(255,123,0,0.2)",
borderWidth:3,
fill:true,
tension:0.4
}]
},

options:{

responsive:true,

scales:{

y:{
min:0,
max:500,
title:{
display:true,
text:"AQI"
}
},

x:{
title:{
display:true,
text:"Time"
}
}

}

}

})



async function fetchData(){

const response = await fetch("/data")

const data = await response.json()



document.getElementById("aqiValue").innerText = data.aqi
document.getElementById("aqiStatus").innerText = data.category

let color = getAQIColor(data.aqi)

document.getElementById("aqiCard").style.borderLeft =
"10px solid " + color



document.getElementById("pm25").innerText = data.pm25
document.getElementById("pm10").innerText = data.pm10
document.getElementById("co").innerText = data.co
document.getElementById("voc").innerText = data.voc
document.getElementById("so2").innerText = data.so2
document.getElementById("no2").innerText = data.no2
document.getElementById("nh3").innerText = data.nh3

document.getElementById("temp").innerText = data.temperature
document.getElementById("hum").innerText = data.humidity



let time = new Date().toLocaleTimeString()

aqiChart.data.labels.push(time)
aqiChart.data.datasets[0].data.push(data.aqi)

if(aqiChart.data.labels.length > 20){

aqiChart.data.labels.shift()
aqiChart.data.datasets[0].data.shift()

}

aqiChart.update()

}


fetchData()

setInterval(fetchData,20000)
