import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, TextField, ThemeProvider, CssBaseline, Switch, Box} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { WbSunny, DarkMode } from "@mui/icons-material";
import { FaSun, FaCloudRain, FaSnowflake, FaWind } from 'react-icons/fa';


const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'clear':
        return <FaSun />;
      case 'rain':
        return <FaCloudRain />;
      case 'snow':
        return <FaSnowflake />;
      case 'wind':
        return <FaWind />;
      default:
        return <FaSun />; 
    }
  };


const cityOptions = [
    "New York", "London", "Tokyo", "Paris",
    "Dubai", "Sydney", "Mumbai", "Toronto", 
    "San Francisco", "Houston", "Beijing", 
    "Los Angeles", "Bangkok", "Alaska", "Washington DC"
];

function Home() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [temperatureUnit, setTemperatureUnit] = useState("metric");

    const theme = createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
        typography: {
            fontFamily: '"Roboto", "Arial", sans-serif', // Set your desired font here
        },
      });

    const toggleTheme = (event) => setDarkMode(event.target.checked);

    const toggleCitySelection = (city) => {
        setSelectedCities((prev) => {
            const newCities = prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city];
            if (newCities.length < 3) {
                setWeatherData([]); 
            }
            return newCities;
        });
    };

    const clearSelectedCities = () => {
        setSelectedCities([]);
        setWeatherData([]);
    };

    const handleCityInputChange = (event) => {
        setCityInput(event.target.value);
    }

    const addCustomCity = () => {
        if (cityInput && !selectedCities.includes(cityInput)) {
            setSelectedCities((prev) => [...prev, cityInput]);
            setCityInput("");
        }
    }

    const fetchWeather = async () => {
        if (selectedCities.length < 3) {
            setError("Please select at least 3 cities.");
            return;
        }

        setError("");
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`http://localhost:8000/weather?cities=${selectedCities.join(",")}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeatherData(response.data);
        } catch (err) {
            setError("Error fetching weather data");
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const iconStyle = {
        fontSize: '15px', 
        marginRight: '8px', 
      };
      
      const getRecommendations = (weather) => {
        const temp = weather.main.temp;
        const wind = weather.wind.speed;
      
        // Temperature-based recommendations
        if (temp < 5) return (
          <div>
            <FaSnowflake style={iconStyle} /> Wear warm clothes, it's freezing!
          </div>
        );
        if (temp >= 5 && temp <= 15) return (
          <div>
            <FaCloudRain style={iconStyle} /> A light jacket is recommended.
          </div>
        );
        if (temp > 15 && temp <= 30) return (
          <div>
            <FaSun style={iconStyle} /> Enjoy the weather! Maybe wear light clothing.
          </div>
        );
        if (temp > 30) return (
          <div>
            <FaSun style={iconStyle} /> Stay hydrated, it's hot! Wear something cool.
          </div>
        );
      
        // Wind-based recommendations
        if (wind > 10) return (
          <div>
            <FaWind style={iconStyle} />Strong winds! Secure loose items.
          </div>
        );
      
        // Default recommendation
        return (
          <div>
            <FaSun style={iconStyle} /> Enjoy your day! No need for extra layers.
          </div>
        );
      };

    const convertToFahrenheit = (tempCelsius) => (tempCelsius * 9/5) + 32;

    const getWeatherBackground = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear sky':
                return 'url(/images/clear-sky.jpg)';
            case 'few clouds':
            case 'scattered clouds':
                return 'url(/images/cloudy.jpg)';
            case 'broken clouds':
            case 'overcast clouds':
                return 'url(/images/overcast.jpg)';
            case 'shower rain':
                return 'url(/images/shower-rain.jpg)';
            case 'rain':
                return 'url(/images/rainy.jpg)';
            case 'thunderstorm':
                return 'url(/images/thunderstorm.jpg)';
            case 'snow':
                return 'url(/images/snow.jpg)';
            case 'mist':
                return 'url(/images/mist.jpg)';
            case 'smoke':
                return 'url(/images/smoke.png)';
            case 'light intensity drizzle rain':
                return 'url(/images/light-intensity-drizzle-rain.jpg)';
            case 'fog':
                return 'url(/images/fog.jpg)';
            default:
                return 'url(/images/default-weather.jpg)';
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                style={{
                    backgroundImage: darkMode
                    ? 'url(/images/night-background.jpg)' : 'url(/images/day-background.jpg)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto', 
                    minHeight: '100vh',
                }}
                >
                {/* Navbar */}
                <AppBar position="fixed" style={{ width: '100%', top: 0, left: 0, zIndex: 1100 }}>
                        <Toolbar style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h4">Weather Tracker</Typography>
                            <div>
                                <Typography variant="body1" style={{ marginRight: "20px", display: "inline" }}>
                                    👤 {currentUser?.email}
                                </Typography>
                                <Button style={{ marginRight: "100px"}} variant="contained" color="error" onClick={handleLogout}>
                                    Logout
                                </Button>
                                <Box 
                                    style={{
                                        position: "absolute",
                                        top: "20px",
                                        right: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <WbSunny style={{ marginRight: "8px", display: darkMode ? "none" : "inline" }} />
                                    <Switch
                                        checked={darkMode}
                                        onChange={toggleTheme}
                                        color="primary"
                                        sx={{ "aria-label": "toggle dark mode" }}
                                    />
                                    <DarkMode style={{ marginLeft: "8px", display: darkMode ? "inline" : "none" }} />
                                </Box>
                            </div>
                        </Toolbar>
                    </AppBar>
                <Container  style={{
                    marginTop: '64px',
                    backgroundColor: darkMode ? '#001f3d' : '#add8e6', 
                    minHeight: '100vh', 
                    paddingTop: '20px',
                    paddingBottom: '40px'
                }}>
                    {/* City Selection */}
                    <Typography variant="h5" style={{ margin: "20px 0 20px 0"}}>
                        SELECT AT LEAST 3 CITIES:
                    </Typography>
                    <Grid container spacing={2} style={{ marginBottom: "20px" }}>
                        {cityOptions.map((city) => (
                            <Grid item key={city}>
                                <Chip
                                    label={city}
                                    onClick={() => toggleCitySelection(city)}
                                    color={selectedCities.includes(city) ? "primary" : "default"}
                                    clickable
                                    sx={{
                                        fontSize: "1.2rem",  
                                        padding: "10px",    
                                        height: "40px",      
                                        minWidth: "100px",   
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <TextField
                        label="Enter Custom City"
                        variant="outlined"
                        value={cityInput}
                        onChange={handleCityInputChange}
                        style={{ marginBottom: "10px"}}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={addCustomCity}
                        style={{ marginBottom: "20px", marginLeft: "10px" }}
                    >Add City</Button>

                    {/* Show Selected Cities */}
                    <Typography variant="h5" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "10px" }}>
                        Selected Cities:
                    </Typography>
                    <Grid container spacing={2} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                        {selectedCities.map((city, index) => (
                            <Grid item key={index}>
                                <Card 
                                    onClick={() => toggleCitySelection(city)}
                                    sx={{
                                        padding: "10px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.2s ease-in-out",
                                        "&:hover": {
                                            transform: "scale(1.1)", // Enlarges the card on hover
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds shadow for effect
                                        },
                                        backgroundColor: selectedCities.includes(city) ? "#1976d2" : "#e3f2fd",
                                        color: selectedCities.includes(city) ? "white" : "black",
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1">{city}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
                        <Button variant="contained" color="primary" onClick={fetchWeather}>
                            Get Weather
                        </Button>
                    </Box>

                    {error && <Typography color="error">{error}</Typography>}

                    <Box style={{ marginLeft: "20px", display: "flex", alignItems: "center", marginTop: "60px" }}>
                                <Typography variant="h6" style={{ marginBottom: "20px", marginRight: "8px" }}>Change Temperature Unit: 
                                    {temperatureUnit === "metric" ? "°C" : "°F"}
                                </Typography>
                                <Switch
                                    checked={temperatureUnit === "imperial"}
                                    onChange={() => setTemperatureUnit(temperatureUnit === "metric" ? "imperial" : "metric")}
                                    color="primary"
                                    sx={{ "aria-label": "toggle temperature unit" }}
                                />
                            </Box>

                    {/* Weather Data */}
                    <Grid container spacing={3}>
                        {weatherData.map((weather, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card style={{
                                    backgroundImage: getWeatherBackground(weather.weather[0].description),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '100%',
                                    color: 'white',
                                    marginBottom: '20px',
                                    position: 'relative',
                                    padding: '20px',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for better text contrast
                                        zIndex: 1,
                                    }}></div>
                                    <CardContent style={{ position: 'relative', zIndex: 2 }}>
                                        <Typography variant="h6">{weather.name || weather.city}</Typography>
                                        {weather.error ? (
                                            <Typography color="error">{weather.error}</Typography>
                                        ) : (
                                            <>
                                                <Typography>🌡️ Temperature: {temperatureUnit === "metric" 
                                                            ? Math.round(weather.main.temp) 
                                                            : Math.round(convertToFahrenheit(weather.main.temp))}{temperatureUnit === "metric" ? "°C" : "°F"}
                                                </Typography>
                                                <Typography>💧 Humidity: {weather.main.humidity}%</Typography>
                                                <Typography>☁️ Conditions: {weather.weather[0].description}</Typography>
                                                <Typography>🌬️ Wind Speed: {weather.wind.speed} m/s</Typography>
                                                <Typography>⏲ Pressure: {weather.main.pressure} hPa</Typography>
                                                <Typography>👁️ Visibility: {weather.visibility / 1000} km</Typography>
                                                <Typography>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</Typography>
                                                <Typography>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</Typography>
                                            </>
                                        )}

                                        {/* Floating Recommendation Panel */}
                                        <div style={{
                                            background: "#ffcc00", color: "#333", padding: "5px 10px",
                                            borderRadius: "5px", fontSize: "14px", marginTop: "10px"
                                        }}>
                                            {getRecommendations(weather)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button variant="contained" color="error" onClick={clearSelectedCities}>
                            Clear All
                        </Button>
                    </Box>
                    
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Home;
