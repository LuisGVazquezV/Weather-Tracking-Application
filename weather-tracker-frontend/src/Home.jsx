import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, TextField, ThemeProvider, CssBaseline, Switch, Box, CardMedia} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { WbSunny, DarkMode } from "@mui/icons-material";
import { FaCloud, FaSun, FaCloudRain, FaSnowflake, FaWind } from 'react-icons/fa';


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
    { name: "New York", image: "/images/cities/new-york.jpg" },
    { name: "London", image: "/images/cities/london.jpg" },
    { name: "Tokyo", image: "/images/cities/tokyo.jpg" },
    { name: "Paris", image: "/images/cities/paris.jpg" },
    { name: "Dubai", image: "/images/cities/dubai.jpg" },
    { name: "Sydney", image: "/images/cities/sydney.jpg" },
    { name: "Mumbai", image: "/images/cities/mumbai.jpg" },
    { name: "Toronto", image: "/images/cities/toronto.jpg" },
    { name: "San Francisco", image: "/images/cities/san-francisco.jpg" },
    { name: "Houston", image: "/images/cities/houston.jpg" },
    { name: "Beijing", image: "/images/cities/beijing.jpg" },
    { name: "Los Angeles", image: "/images/cities/los-angeles.jpg" },
    { name: "Bangkok", image: "/images/cities/bangkok.jpg" },
    { name: "Alaska", image: "/images/cities/alaska.jpg" },
    { name: "Washington DC", image: "/images/cities/washington-dc.jpg" },
    { name: "Seoul", image: "/images/cities/seoul.jpg"},
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
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
      };

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
        const humidity = weather.main.humidity;
        const uvi = weather.uvi; 
        const description = weather.weather[0].description.toLowerCase();
    
        
        const iconStyle = {
            width: "24px",       
            height: "24px",      
            verticalAlign: "middle",  
            marginRight: "8px"   
        };
    
        // Temperature-based recommendations
        if (temp < 5) return (
            <div>
                <img src="/snowflake.svg" alt="snowflake" style={iconStyle} /> 
                Brrr! It’s freezing! Layer up and stay cozy indoors, or go make a snowman!
                <img src="/snowBoots.svg" alt="snow boots" style={iconStyle} />
            </div>
        );
        if (temp >= 5 && temp <= 15) return (
            <div>
                <img src="/cloudRain.svg" alt="cloud rain" style={iconStyle} />
                It’s chilly, so a warm jacket and scarf are your best friends today.
                <img src="/jacket.svg" alt="jacket" style={iconStyle} />
                <img src="/scarf.svg" alt="scarf" style={iconStyle} />
            </div>
        );
        if (temp > 15 && temp <= 30) return (
            <div>
                <img src="/sun.svg" alt="sun" style={iconStyle} />
                Perfect weather for a walk in the park or outdoor activities. Don't forget sunscreen!
                <img src="/sunscreen.svg" alt="sunscreen" style={iconStyle} />
            </div>
        );
        if (temp > 30) return (
            <div>
                <img src="/sunHot.svg" alt="hot sun" style={iconStyle} />
                It’s sweltering out there! Stay hydrated, wear light clothing, and stay cool in the shade.
                <img src="/waterBottle.svg" alt="water bottle" style={iconStyle} />
                <img src="/hat.svg" alt="hat" style={iconStyle} />
            </div>
        );
    
        // Wind-based recommendations
        if (wind > 10) return (
            <div>
                <img src="/wind.svg" alt="wind" style={iconStyle} />
                Hold onto your hat – it’s windy! Secure any loose items and brace for gusty winds.
                <img src="/hatWind.svg" alt="wind hat" style={iconStyle} />
            </div>
        );
    
        // Humidity-based recommendations
        if (humidity > 80) return (
            <div>
                <img src="/humidity.svg" alt="humidity" style={iconStyle} />
                Humid and sticky today. You might want to stay inside or wear something breathable.
                <img src="/breathableClothing.svg" alt="breathable clothing" style={iconStyle} />
            </div>
        );
        if (humidity < 20) return (
            <div>
                <img src="/sunDry.svg" alt="dry sun" style={iconStyle} />
                It’s dry out there! Drink plenty of water and consider using a moisturizer.
                <img src="/waterBottle.svg" alt="water bottle" style={iconStyle} />
                <img src="/moisturizer.svg" alt="moisturizer" style={iconStyle} />
            </div>
        );
    
        // UV index-based recommendations
        if (uvi > 8) return (
            <div>
                <img src="/sunHighUV.svg" alt="high UV" style={iconStyle} />
                High UV index – wear sunscreen, sunglasses, and a hat if you’re stepping out!
                <img src="/sunscreen.svg" alt="sunscreen" style={iconStyle} />
                <img src="/sunglasses.svg" alt="sunglasses" style={iconStyle} />
            </div>
        );
        if (uvi > 5) return (
            <div>
                <img src="/sunModerateUV.svg" alt="moderate UV" style={iconStyle} />
                Moderate UV today. You’ll be fine without sunscreen for short periods, but better safe than sorry!
                <img src="/sunscreen.svg" alt="sunscreen" style={iconStyle} />
            </div>
        );
        if (uvi <= 5) return (
            <div>
                <img src="/cloudLowUV.svg" alt="low UV" style={iconStyle} />
                Low UV today. You’re good to go without sunscreen for short periods outdoors.
            </div>
        );
    
        // Additional conditions (Thunderstorm, Fog, etc.)
        if (description.includes("thunderstorm")) return (
            <div>
                <img src="/thunderstorm.svg" alt="thunderstorm" style={iconStyle} />
                A thunderstorm is expected! Stay indoors and stay safe.
                <img src="/lightning.svg" alt="lightning" style={iconStyle} />
            </div>
        );
        if (description.includes("fog") || description.includes("mist")) return (
            <div>
                <img src="/fog.svg" alt="fog" style={iconStyle} />
                Visibility is low. Drive carefully and avoid unnecessary travel.
                <img src="/fogLights.svg" alt="fog lights" style={iconStyle} />
            </div>
        );
        if (description.includes("rain")) return (
            <div>
                <img src="/rain.svg" alt="rain" style={iconStyle} />
                It’s raining. Don’t forget your umbrella, and stay dry!
                <img src="/umbrella.svg" alt="umbrella" style={iconStyle} />
            </div>
        );
        if (description.includes("cloud")) return (
            <div>
                <img src="/cloud.svg" alt="cloudy" style={iconStyle} />
                It’s cloudy but mild. A perfect day for a cozy indoor activity or light outdoor walk.
            </div>
        );
    
        // Default recommendation
        return (
            <div>
                <img src="/sun.svg" alt="sun" style={iconStyle} />
                Nice and balanced weather. Go for a hike, picnic, or just relax outdoors!
                <img src="/picnic.svg" alt="picnic" style={iconStyle} />
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
            case 'light rain':
                return 'url(/images/light-rain.jpg)';
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FaCloud style={{ marginRight: "4px", fontSize: "3rem" }} /> 
                            <Typography variant="h4">Weather Tracker</Typography>
                        </div>
                            <div>
                                <Typography variant="body1" style={{ marginRight: "20px", display: "inline" }}>
                                    👤 {currentUser?.email}
                                </Typography>
                                <Button style={{ marginRight: "100px", fontSize: 20}} variant="outlined" color="white" onClick={handleLogout}>
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
                    <Typography variant="h4" style={{ margin: "20px 0 20px 0"}}>
                        Welcome to the Weather Tracker!
                    </Typography>
                    <Typography variant="h6" style={{ margin: "20px 0 20px 0"}}>
                    Stay updated with real-time weather information for your favorite cities around the world. 
                    Simply select at least three cities, and we'll show you the latest weather data, including temperature, humidity, wind speed, and more. 
                    You can also switch between Celsius and Fahrenheit, and enjoy personalized weather recommendations based on the conditions.
                    </Typography>
                    <Typography variant="h5" style={{ margin: "20px 0 20px 0"}}>
                        SELECT AT LEAST 3 CITIES:
                    </Typography>
                    <Grid container spacing={2} style={{ marginBottom: "20px" }}>
                        {cityOptions.slice(0, showMore ? cityOptions.length : 8).map((city) => (
                            <Grid item key={city.name} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    onClick={() => toggleCitySelection(city.name)}
                                    sx={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s ease-in-out",
                                        "&:hover": {
                                            transform: "scale(1.05)", 
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                        },
                                        border: selectedCities.includes(city.name) ? "3px solid #1976d2" : "none",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={city.image}
                                        alt={city.name}
                                    />
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="h6">{city.name}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box style={{ display: "flex", justifyContent: "right", marginTop: "20px" }}>
                        {cityOptions.length > 8 && (
                            <Button style={{fontSize: 18}} variant="outlined" color="primary" onClick={toggleShowMore}>
                                {showMore ? "Show Less" : "Show More Cities"}
                            </Button>
                        )}
                    </Box>

                    <TextField
                        label="Enter Custom City"
                        variant="outlined"
                        value={cityInput}
                        onChange={handleCityInputChange}
                        style={{ marginBottom: "10px", marginTop: "20px"}}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={addCustomCity}
                        style={{ fontSize: 25, marginBottom: "20px", marginLeft: "10px", marginTop: "20px" }}
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
                                            transform: "scale(1.1)", 
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
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

                    <Box style={{display: "flex", justifyContent: "center", marginTop: "60px" }}>
                        <Button style={{fontSize: 20}}variant="outlined" color="primary" onClick={fetchWeather}>
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
                                            <Typography style={fontSize=15} color="error">{weather.error}</Typography>
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
                                            background: "#45b6fe", color: "black", padding: "5px 10px",
                                            borderRadius: "5px", fontSize: "16px", marginTop: "20px", borderColor: "white"
                                        }}>
                                            {getRecommendations(weather)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button style={{fontSize: 20}} variant="outlined" color="error" onClick={clearSelectedCities}>
                            Clear All
                        </Button>
                    </Box>
                    
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Home;
