import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
} from "@mui/material";
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

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const Signup = () => {

  const [videoSrc, setVideoSrc] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {

    const randomVideo = videos[Math.floor(Math.random() * videos.length)]
    setVideoSrc(randomVideo);
  }, []);

  useEffect(() => {
   if (videoRef.current){ 
    videoRef.current.playbackRate = 0.75;
    }
  }, [videoSrc]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <CssBaseline />
      <Stack height="100vh" justifyContent="center" alignItems="center">
        {videoSrc&& (
          <VideoBackground ref={videoRef} autoPlay loop muted>
            <source src = {videoSrc} type ="video/mp4" />
          </VideoBackground>
        )}
        <StyledCard variant="outlined">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CloudIcon sx={{ fontSize: 50, color: "#2196F3" }} />
        </Box>
          <Typography variant = "h4" fontWeight="bold" align="center">Weather Tracker</Typography> 
          <Typography variant="h5" fontWeight="bold" align="center">
            Sign-Up
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSignup} display="flex" flexDirection="column" gap={2}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </FormControl>
            <Button type="submit" variant="contained" fullWidth>
              Sign Up
            </Button>
          </Box>
          <Divider>or</Divider>
          <Typography align="center">
            Already have an account? <Link href="/login">Log In</Link>
          </Typography>
        </StyledCard>
      </Stack>
    </>
  );
};

export default Signup;
