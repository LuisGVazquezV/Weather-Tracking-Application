import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, Divider, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudIcon from "@mui/icons-material/Cloud";

const videos = ["/clouds.mp4", "/rain.mp4", "/snow.mp4", "/wind.mp4"];

const VideoBackground = styled("video") ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -1
});

const LoginCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    width: "100%",
    maxWidth: "400px",
    margin: "auto",
    boxShadow: theme.shadows[5],
}));

function Login() {

    const [videoSrc, setVideoSrc] = useState("");
    const videoRef = useRef(null);
    
      useEffect(() => {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)]
        setVideoSrc(randomVideo);
      }, []);

      useEffect(() => {
        if (videoRef.current) {
          videoRef.current.playbackRate = 0.5; 
        }
      }, [videoSrc]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            {videoSrc&& (
                <VideoBackground ref={videoRef} autoPlay loop muted>
                    <source src = {videoSrc} type ="video/mp4" />
                </VideoBackground>
            )}
            <LoginCard variant="outlined">
                <CloudIcon  sx={{justifyContent: "center", alignItems:"center", fontSize: 50, color: "#2196F3"}} />
                <Typography variant = "h4" fontWeight="bold" align="center">Weather Tracker</Typography>
                <Typography variant = "h5" fontWeight="bold" align="center">Login</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2} width="100%">
                    <TextField 
                        type="email" 
                        label="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        fullWidth 
                    />
                    <TextField 
                        type="password" 
                        label="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        fullWidth 
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Log In
                    </Button>
                </Box>
                <Divider sx={{ width: "100%" }} />
                <Typography>
                    Don't have an account? <Link href="/">Sign Up</Link>
                </Typography>
            </LoginCard>
        </Box>
    );
}

export default Login;
