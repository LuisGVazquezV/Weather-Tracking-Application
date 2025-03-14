# Weather Tracking Application

## Overview
The Weather Tracking Application is built as part of the Production Manager training at Revature. It provides real-time weather updates, visualizations, and alerting mechanisms using a modern tech stack.

## Tech Stack
- **Front-End**: React, Axios, Material UI
- **Back-End**: FastAPI, Flask
- **Weather Data Source**: OpenWeather API
- **Monitoring & Visualization**: Prometheus, Grafana
- **Alerting**: Prometheus Alertmanager

## Features
### React Front-End
- User authentication (via Firebase/Auth0 or Node.js-based backend)
- Displays real-time weather data using Axios to fetch data from the FastAPI/Flask backend
- Provides weather-based recommendations
- Styled using Material UI for an enhanced UI/UX

### Python Back-End
- Built using **FastAPI** and **Flask** for handling API requests
- Fetches weather data from the **OpenWeather API**
- Exposes weather data via REST API endpoints
- Formats data for Prometheus metrics scraping

### Prometheus & Alertmanager
- **Prometheus** scrapes weather metrics (temperature, humidity, wind speed, etc.) from the backend
- **Alertmanager** sends notifications when extreme weather conditions are detected
- Alerts can be configured for Slack, email, or other services

### Grafana
- Visualizes weather trends with time-series dashboards
- Provides forecasting based on historical data from Prometheus

## Implementation Plan
### 1. Set Up the React Front-End
- Initialize a React project and configure authentication
- Create UI components for weather display and alerts using Material UI
- Use Axios to fetch weather data from the Python backend

### 2. Build the Python Back-End
- Set up **FastAPI/Flask** server
- Fetch weather data from **OpenWeather API**
- Expose Prometheus metrics via `/metrics` endpoint
- Serve weather data to the React front-end

### 3. Configure Prometheus
- Install and configure Prometheus to scrape weather data from the backend
- Define Prometheus metrics for temperature, humidity, wind speed, etc.

### 4. Set Up Alertmanager
- Configure alerts for extreme weather conditions (e.g., high temperatures, storms)
- Send notifications via email, Slack, or other channels

### 5. Install and Configure Grafana
- Connect **Grafana** to **Prometheus**
- Create interactive dashboards for weather data visualization
- Implement forecasting and trend analysis

## Future Enhancements
- Implement WebSockets for real-time weather updates
- Integrate additional weather APIs for improved forecasting
- Deploy the system using Docker & Kubernetes for scalability

## Setup & Deployment
- Clone the repository
- Install dependencies for React (`npm install`) and Python (`pip install -r requirements.txt`)
- Start the React front-end (`npm start`)
- Start the Python backend (`uvicorn main:app --reload` for FastAPI or `flask run` for Flask)
- Set up Prometheus and Grafana according to configuration files

---
This project demonstrates the integration of modern web development and monitoring tools to create a reliable weather tracking system.

