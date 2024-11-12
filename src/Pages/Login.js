import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (isSubmitting) return;
    setIsSubmitting(true);


    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Sending login request with:', { username, password });


      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.message === 'Login successful') {

        onLogin(username);
        navigate('/home'); 
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        console.error('Error response from server:', error.response);
        setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrorMessage('No response from server. Please try again later.');
      } else {
        console.error('Error in request setup:', error.message);
        setErrorMessage('Error occurred during login. Please try again.');
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="webpageDiv">
      <h2 className="loginTitle">Login</h2>
      <h3 className="loginTitle2">Please Enter Your Login and Password</h3>
      <div className="loginBackground">
        <form onSubmit={handleSubmit} className="loginDiv">
          <div>
            <input
              className="login"
              placeholder="👤 Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="login"
              placeholder="🔑 Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button className="submitButton" type="submit" disabled={isSubmitting}>
            Login
          </button>
          <h3 className="signUpNavigation">
            Don't have an account?{' '}
            <Link to="/signup" className="signupLink">
              Sign up
            </Link>{' '}
            now
          </h3>
        </form>
      </div>
    </div>
  );
}

export default Login;
