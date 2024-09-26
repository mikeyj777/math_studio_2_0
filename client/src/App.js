// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MathStudioDisplay from './components/MathStudioDisplay';
import './styles/App.css';
import './styles/CommonStyles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/math-studio/:userId" element={<MathStudioDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;