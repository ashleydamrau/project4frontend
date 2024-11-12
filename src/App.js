import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Login';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import './style.css'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    const storedUsername = localStorage.getItem('username');
    if (storedAuthState === 'true') {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);


    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
  };

  const handleSignup = (newUsername) => {
    setIsAuthenticated(true);
    setUsername(newUsername);


    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', newUsername);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route to display either Home or Login based on authentication */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Home username={username} /> : <Navigate to="/login" replace />} 
        />

        {/* Separate route for /login to prevent automatic redirects */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />

        {/* Protect /home route, redirect to login if not authenticated */}
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home username={username} /> : <Navigate to="/login" replace />} 
        />

        {/* Signup route, passing handleSignup to Signup component */}
        <Route 
          path="/signup" 
          element={<Signup onSignup={handleSignup} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
