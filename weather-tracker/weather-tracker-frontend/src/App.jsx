import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import PrivateRoute from './auth/PrivateRoute'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box } from '@mui/material'
import { ThemeProvider } from './utils/theme/ThemeProvider';
import { ThemeToggle } from './utils/theme/ThemeToggle';
import { ThemeContextProvider } from './utils/theme/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Box
              className="app-container"
              sx={{
                bgcolor: 'background.default',
                minHeight: '100vh',
                color: 'text.primary',
                transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out'
              }}
            >
              <ThemeToggle />

              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </Box>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ThemeContextProvider>
  );
}

export default App;