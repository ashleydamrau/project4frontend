import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (isSubmitting) return;
    setIsSubmitting(true); 

    console.log('Form submitted with:', { username, password });

   
    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      setIsSubmitting(false); 
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsSubmitting(false); 
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password,
      });

      console.log('Signup Response:', response.data);

      if (response.data.message === 'User registered successfully') {
        console.log("Signup successful:", response.data);


        onSignup(username);


        navigate('/login');
      } else {
        setErrorMessage(response.data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'There was an error with your signup. Please try again.');
      } else if (error.request) {
        setErrorMessage('No response from server. Please try again later.');
      } else {
        setErrorMessage('Error occurred during signup. Please try again later.');
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div>
      <h2 className="loginTitle">Sign Up</h2>
      <h3 className="loginTitle2">Enter Your Signup Information Here</h3>
      <form onSubmit={handleSubmit} className="signupDiv">
        <div>
          <input
            className="signupInput"
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="signupInput"
            type="password"
            placeholder="🔑 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="signupInput"
            type="password"
            placeholder="🔑 Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Display error message if any */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button className="signupButton" type="submit" disabled={isSubmitting}>
          Sign Up
        </button>

        <h3 className="signUpNavigation">
          Already Have an Account? <Link to="/login" className="loginLink">Login</Link> now
        </h3>
      </form>
    </div>
  );
}

export default Signup;
