from flask import Flask, request, jsonify
import requests
from prometheus_client import Gauge, generate_latest, CollectorRegistry, CONTENT_TYPE_LATEST
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Create a new registry for Prometheus
registry = CollectorRegistry()

# Define Prometheus Gauges in the custom registry
weather_temperature = Gauge("weather_temperature", "Temperature in Celsius", ["city"], registry=registry)
weather_feels_like = Gauge("weather_feels_like", "Feels-like temperature in Celsius", ["city"], registry=registry)
weather_humidity = Gauge("weather_humidity", "Humidity percentage", ["city"], registry=registry)
weather_wind_speed = Gauge("weather_wind_speed", "Wind speed in m/s", ["city"], registry=registry)
weather_pressure = Gauge("weather_pressure", "Atmospheric pressure in hPa", ["city"], registry=registry)
weather_precipitation = Gauge("weather_precipitation", "Rain volume in mm (last 1 hour or 3 hours)", ["city"], registry=registry)
weather_visibility = Gauge("weather_visibility", "Visibility in meters", ["city"], registry=registry)
weather_sunrise = Gauge("weather_sunrise", "Sunrise timestamp (Unix)", ["city"], registry=registry)
weather_sunset = Gauge("weather_sunset", "Sunset timestamp (Unix)", ["city"], registry=registry)
weather_uv_index = Gauge("weather_uv_index", "UV index", ["city"], registry=registry)  # Requires One Call API

# OpenWeather API Config
API_KEY = "651dc926e8049aec6b9297fa058d9948"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
UVI_URL = "http://api.openweathermap.org/data/2.5/uvi"

# Dictionary to keep track of the latest weather data for each city
latest_weather_data = {}

@app.route('/weather', methods=['POST'])
def get_weather():
    global latest_weather_data

    data = request.json
    cities = data.get("cities", [])
    if not cities:
        return jsonify({"error": "No cities provided"}), 400

    new_cities = set(cities)
    old_cities = set(latest_weather_data.keys())

    # Remove metrics for cities that are no longer being updated
    outdated_cities = old_cities - new_cities
    for city in outdated_cities:
        weather_temperature.remove(city=city)
        weather_feels_like.remove(city=city)
        weather_humidity.remove(city=city)
        weather_wind_speed.remove(city=city)
        weather_pressure.remove(city=city)
        weather_visibility.remove(city=city)
        weather_precipitation.remove(city=city)
        weather_sunrise.remove(city=city)
        weather_sunset.remove(city=city)
        weather_uv_index.remove(city=city)

    updated_data = {}

    for city in cities:
        response = requests.get(f"{BASE_URL}?q={city}&appid={API_KEY}&units=metric")
        if response.status_code == 200:
            weather_data = response.json()
            
            # Extract weather metrics
            temp = weather_data["main"]["temp"]
            feels_like = weather_data["main"]["feels_like"]
            humidity = weather_data["main"]["humidity"]
            wind_speed = weather_data["wind"]["speed"]
            pressure = weather_data["main"]["pressure"]
            visibility = weather_data.get("visibility", 0)
            sunrise = weather_data["sys"]["sunrise"]
            sunset = weather_data["sys"]["sunset"]

            # Handle precipitation (rain volume in last 1h or 3h)
            rain_1h = weather_data.get("rain", {}).get("1h", 0)
            rain_3h = weather_data.get("rain", {}).get("3h", 0)
            precipitation = rain_1h if rain_1h else rain_3h

            # Fetch UV index using coordinates
            lat, lon = weather_data["coord"]["lat"], weather_data["coord"]["lon"]
            uv_response = requests.get(f"{UVI_URL}?lat={lat}&lon={lon}&appid={API_KEY}")
            uv_index = uv_response.json().get("value", 0) if uv_response.status_code == 200 else 0

            # Store the updated weather data
            updated_data[city] = {
                "temperature": temp,
                "feels_like": feels_like,
                "humidity": humidity,
                "wind_speed": wind_speed,
                "pressure": pressure,
                "visibility": visibility,
                "precipitation": precipitation,
                "sunrise": sunrise,
                "sunset": sunset,
                "uv_index": uv_index
            }

            # Update Prometheus metrics for the city
            weather_temperature.labels(city=city).set(temp)
            weather_feels_like.labels(city=city).set(feels_like)
            weather_humidity.labels(city=city).set(humidity)
            weather_wind_speed.labels(city=city).set(wind_speed)
            weather_pressure.labels(city=city).set(pressure)
            weather_visibility.labels(city=city).set(visibility)
            weather_precipitation.labels(city=city).set(precipitation)
            weather_sunrise.labels(city=city).set(sunrise)
            weather_sunset.labels(city=city).set(sunset)
            weather_uv_index.labels(city=city).set(uv_index)

            print(f"✅ Updated metrics for {city}: Temp={temp}, FeelsLike={feels_like}, UV={uv_index}")
        else:
            print(f"❌ Failed to fetch weather for {city}: {response.status_code}")

    # Replace the previous weather data with the new update
    latest_weather_data = updated_data
    return jsonify({"message": "Weather data updated successfully"}), 200

@app.route('/metrics')
def metrics():
    """Expose Prometheus metrics."""
    return generate_latest(registry), 200, {'Content-Type': CONTENT_TYPE_LATEST}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
