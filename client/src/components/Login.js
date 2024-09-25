import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Login() {
  
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name) {
        return;
      } 
      console.log("logging in.  url is " + API_BASE_URL)
      console.log("full url as interpreted by react is " + `${API_BASE_URL}/api/users`)
      const res = await axios.post(`${API_BASE_URL}/api/users`, { name });
      const userId = res.data.userId;
      const grade_level = res.data.grade_level;
      const special_education = res.data.special_education;
      localStorage.setItem('userId', userId);
      localStorage.setItem('grade_level', grade_level);
      localStorage.setItem('special_education', special_education);
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="gradient-layout">
      <div className="gradient-layout-content">
        <h1 className="gradient-layout-title">Math Studio</h1>
        <h2>Enter your name or your grade level to log in.</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="button button-primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;