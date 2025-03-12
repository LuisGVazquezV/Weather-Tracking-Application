import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, Divider, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

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
            <LoginCard>
                <Typography variant="h4">Login</Typography>
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
                        Login
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
