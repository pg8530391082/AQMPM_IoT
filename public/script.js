let gauge=document.getElementById("aqiGauge")

function updateAQI(aqi){

document.getElementById("aqiNumber").innerText=aqi

let percent=aqi/300
let offset=251-(251*percent)

gauge.style.strokeDashoffset=offset

let status=""
let glow=""

if(aqi<=50){
status="Good"
glow="good-glow"
gauge.style.stroke="#22c55e"
}
else if(aqi<=100){
status="Moderate"
glow="moderate-glow"
gauge.style.stroke="#facc15"
}
else if(aqi<=150){
status="Unhealthy"
glow="unhealthy-glow"
gauge.style.stroke="#fb923c"
}
else if(aqi<=200){
status="Poor"
glow="poor-glow"
gauge.style.stroke="#ef4444"
}
else{
status="Hazardous"
glow="hazardous-glow"
gauge.style.stroke="#a855f7"
}

document.getElementById("aqiStatus").innerText=status

let card=document.getElementById("aqiCard")
card.className="aqi-card "+glow

}



async function fetchData(){

const response=await fetch("/data")

const data=await response.json()

updateAQI(data.aqi)

document.getElementById("pm25").innerText=data.pm25
document.getElementById("pm10").innerText=data.pm10
document.getElementById("co").innerText=data.co
document.getElementById("voc").innerText=data.voc
document.getElementById("so2").innerText=data.so2
document.getElementById("no2").innerText=data.no2
document.getElementById("nh3").innerText=data.nh3
document.getElementById("temp").innerText=data.temperature

}

setInterval(fetchData,20000)
