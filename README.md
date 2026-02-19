# 🌍 AQMPM – Air Quality Monitoring IoT System

## 📌 Project Overview
AQMPM (Air Quality Monitoring Project Mega) is a real-time IoT-based air quality monitoring system that measures pollutant levels and displays live AQI data on a web dashboard.

This system integrates:
- Arduino Mega (Sensor Node)
- ESP32 (WiFi Gateway)
- Node.js Backend (Render Hosting)
- Dynamic Web Dashboard

---

## 🏗️ System Architecture

Sensors → Arduino Mega → ESP32 → Node.js Server → Live Dashboard

---

## 🔧 Hardware Components
- MQ5 – Carbon Monoxide (CO)
- MQ3 – Alcohol
- MQ135 – VOC, SO₂, NO₂, NH₃
- Dust Sensor – PM2.5 / PM10
- DHT11 – Temperature & Humidity
- Arduino Mega 2560
- ESP32 WiFi Module

---

## 🌐 Software Stack
- Arduino IDE (Embedded Programming)
- ESP32 WiFi Communication
- Node.js + Express Backend
- Chart.js (Live Graphs)
- Render Cloud Deployment

---

## 📊 Features
- Real-time AQI Calculation
- Dynamic AQI Color Indicator
- Live Graph Visualization
- REST API for Data Transfer
- Automatic Data Refresh (5 sec)
- Cloud Hosted Dashboard

---

## 📡 API Endpoints

### Receive Sensor Data
POST `/api/data`

### Get Latest Data
GET `/api/data`

---

## 🚀 Deployment
Hosted on Render Cloud Platform.

---

## 👨‍💻 Author
Piyush Gaikwad  
Electrical Engineering Student  
IoT & Embedded Systems Project
