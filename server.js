const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname,"public")))

let sensorData = {
  aqi:0,
  pm25:0,
  pm10:0,
  co:0,
  voc:0,
  so2:0,
  no2:0,
  nh3:0,
  alcohol_aqi:0,
  temperature:0,
  humidity:0
}

app.post("/update",(req,res)=>{
sensorData = req.body
console.log("New Sensor Data:",sensorData)
res.json({status:"received"})
})

app.get("/data",(req,res)=>{
res.json(sensorData)
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
