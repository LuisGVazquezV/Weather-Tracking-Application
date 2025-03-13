# Weather-App

## Tools
Install the following software tools:

- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [VS Code](https://code.visualstudio.com/) - A source-code editor made by Microsoft for Windows, Linux, and macOS.
- [Python](https://www.python.org/) - A programming language that lets you work quickly and integrate systems effectively.
- [Prometheus](https://prometheus.io/) - Open-source monitoring and alerting toolkit designed for reliability and scalability.
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) - Handles alerts sent by Prometheus server.
- [Grafana](https://grafana.com/) - Open-source platform for monitoring and observability.


## Create Accounts & Setup
- [OpenWeather](https://openweathermap.org/) - Provides weather data, including current weather, forecasts, and historical data.
- [Firebase](https://firebase.google.com/) - A platform for building web applications, offering authentication.


## Getting Started
1. Clone the repo

2. cd to the frontend folder (weather-tracker) and install all packages for react
```bash
npm install # install packages
npm run dev # to run application
```

3. Cd to the backend and install all pip requirements (Make sure python is installed first).
```bash
    pip install fastapi uvicorn requests python-dotenv firebase-admin flask flask_cors prometheus_client
```

4. Create a `serviceAccountKey` json and .env file.
    - navigate to firebase `Project Settings`.
    - Then `Service accounts`.
    - Generate new private key `Node.js` copy and paste to `serviceAccountKey.json`
    - In the .env `WEATHER_API_KEY=YOUR_API_KEY`

5. Create a new terminal in VS code (`Command prompt`) to create Virtual Enviroment.
```bash
python3 -m venv venv
```

6. Acitve the `venv` and run it using `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
```bash
venv\Scripts\activate #Active
uvicorn main:app --host 0.0.0.0 --port 8000 --reload # Run
```

7. Run the app.py to collect metrics in a new terminal (`Command Prompt`).
```bash
python app.py # Run 
```

8. In `Prometheus` and `Alertmanager` copy the yaml files content

9. Run both `prometheus.exe` and `alertmanager.exe`

10. Run the local hosts.
 - Access the main application at http://localhost:5173
 - Access Prometheus at http://localhost:9090
 - Access Alertmanager at http://localhost:9093
 - Access Prometheus Metrics at http://localhost:5000/metrics
 - Access Grafana at http://localhost:3000