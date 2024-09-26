import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as helpers from '../utils/helpers';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await helpers.loginUser(username);
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate(`/math-studio/${userData.userId}`);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message)
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Math Studio 2.0</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;