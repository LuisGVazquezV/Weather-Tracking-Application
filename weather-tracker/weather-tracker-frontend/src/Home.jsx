import React, { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, CircularProgress, Stack, useTheme, useMediaQuery } from "@mui/material";
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

const cityOptions = [
    "New York", "London", "Tokyo", "Paris", "Berlin",
    "Dubai", "Sydney", "Mumbai", "Toronto", "San Francisco"
];

function Home() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedCities, setSelectedCities] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Add responsive breakpoint
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Check if user is authenticated
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Clear any existing errors
        setError("");
    }, [currentUser, navigate]);

    const toggleCitySelection = (city) => {
        setSelectedCities((prev) =>
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        );
    };

    const clearAllSelections = () => {
        setSelectedCities([]);
        setWeatherData([]);
        setError("");
        toast.info("All selections cleared");
    };

    const fetchWeather = async () => {
        if (selectedCities.length < 3) {
            toast.error("Please select at least 3 cities.");
            setError("Please select at least 3 cities.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`http://localhost:8000/weather?cities=${selectedCities.join(",")}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeatherData(response.data);
            toast.success("Weather data fetched successfully!");
        } catch (err) {
            console.error("Error fetching weather data:", err);
            const errorMessage = err.response?.data?.message || err.message || "Error fetching weather data";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    const getRecommendations = (weather) => {
        if (!weather || !weather.main) return "No recommendations available.";

        const temp = weather.main.temp;
        const wind = weather.wind.speed;

        if (temp < 5) return "🧥 Wear warm clothes, it's freezing!";
        if (temp >= 5 && temp <= 15) return "🧣 A light jacket is recommended.";
        if (temp > 15 && temp <= 30) return "😎 Enjoy the weather!";
        if (temp > 30) return "🥵 Stay hydrated, it's hot!";
        if (wind > 10) return "💨 Strong winds! Secure loose items.";

        return "🌤️ Enjoy your day!";
    };

    if (!currentUser) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
            {/* Navbar */}
            <AppBar position="fixed">
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap>Weather Tracker</Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="body1"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            👤 {currentUser?.email}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                            size={isMobile ? "small" : "medium"}
                        >
                            Logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            {/* Main Content - Add toolbar spacing */}
            <Toolbar />

            {/* City Selection */}
            <Typography variant="h5" sx={{ my: 3 }}>
                Select at least 3 cities: {selectedCities.length > 0 && `(${selectedCities.length} selected)`}
            </Typography>
            <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
                {cityOptions.map((city) => (
                    <Grid item key={city}>
                        <Chip
                            label={city}
                            onClick={() => toggleCitySelection(city)}
                            color={selectedCities.includes(city) ? "primary" : "default"}
                            clickable
                            size={isMobile ? "small" : "medium"}
                        />
                    </Grid>
                ))}
            </Grid>

            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{
                    mb: 3,
                    width: isMobile ? '100%' : 'auto'
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchWeather}
                    disabled={loading || selectedCities.length < 3}
                    size={isMobile ? "large" : "medium"}
                    fullWidth={isMobile}
                    sx={{
                        minWidth: { xs: '100%', sm: '200px' }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Get Weather"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearAllSelections}
                    disabled={loading || selectedCities.length === 0}
                    startIcon={<ClearIcon />}
                    size={isMobile ? "large" : "medium"}
                    fullWidth={isMobile}
                    sx={{
                        minWidth: { xs: '100%', sm: '200px' }
                    }}
                >
                    Clear All ({selectedCities.length})
                </Button>
            </Stack>

            {error && (
                <Typography color="error" sx={{ mb: 3 }}>
                    {error}
                </Typography>
            )}

            {/* Weather Data */}
            <Grid container spacing={isMobile ? 2 : 3}>
                {weatherData.map((weather, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                    >
                        <Card
                            elevation={3}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: (theme) => theme.shadows[6]
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                                    {weather.name || weather.city}
                                </Typography>
                                {weather.error ? (
                                    <Typography color="error">{weather.error}</Typography>
                                ) : (
                                    <Stack spacing={1}>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            🌡️ Temperature: {weather.main.temp}°C
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            💧 Humidity: {weather.main.humidity}%
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            ☁️ Conditions: {weather.weather[0].description}
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            🌬️ Wind Speed: {weather.wind.speed} m/s
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            🧭 Pressure: {weather.main.pressure} hPa
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            👁️ Visibility: {weather.visibility / 1000} km
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant={isMobile ? "body2" : "body1"}>
                                            🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                                        </Typography>
                                    </Stack>
                                )}

                                {/* Floating Recommendation Panel */}
                                <div style={{
                                    background: "#ffcc00",
                                    color: "#333",
                                    padding: isMobile ? "8px" : "10px",
                                    borderRadius: "5px",
                                    marginTop: "10px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    fontSize: isMobile ? "14px" : "16px"
                                }}>
                                    {getRecommendations(weather)}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;