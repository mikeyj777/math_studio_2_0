import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MathEngine from './MathEngine';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import * as helpers from '../utils/helpers';

const MathStudioDisplay = ({ student = {}, problem = {}, onAnswer, stats = {} }) => {
  const [answer, setAnswer] = useState('');
  const [streakData, setStreakData] = useState([]);


  //  get user data
  const userId = localStorage.getItem('userId');
  const gradeLevelFromStorage = localStorage.getItem('grade_level');
  const specialEducation = localStorage.getItem('special_education') === 'true';

  //  determine if user is in special ed
  const gradeLevel = specialEducation ? 'special_education' : gradeLevelFromStorage;
  
  console.log("from math studio display")
  console.log("user id is " + userId)
  console.log("grade level is " + gradeLevel)
  console.log("special education is " + specialEducation)

  const curriculum = helpers.fetchCurriculum(gradeLevel);

  console.log("curriculum is " + curriculum);
  // get problem
  const me = new MathEngine(curriculum);
  problem =me.generateProblem();

  console.log("problem is " + problem);

  //get stats
  stats = helpers.fetchStats(userId);

  useEffect(() => {
    if (stats.currentStreak !== undefined) {
      setStreakData(prevData => [...prevData, { time: new Date().getTime(), streak: stats.currentStreak }]);
    }
  }, [stats.currentStreak]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAnswer) onAnswer(answer);
    setAnswer('');
  };

  return (
    <div className="math-studio-container">
      <div className="card">
        <div className="card-header">
          <h2>{student.name || 'Student'} - Grade {student.grade || 'N/A'}</h2>
        </div>
        <div className="card-content">
          <h3>Problem:</h3>
          <p>{problem.question || 'Loading problem...'}</p>
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="card-header">
            <h4>Current Streak</h4>
          </div>
          <div className="card-content">
            <p className="stat-value">{stats.currentStreak || 0}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-header">
            <h4>Session Score</h4>
          </div>
          <div className="card-content">
            <p className="stat-value">{stats.sessionCorrect || 0} / {stats.sessionTotal || 0}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-header">
            <h4>All-Time Score</h4>
          </div>
          <div className="card-content">
            <p className="stat-value">{stats.allTimeCorrect || 0} / {stats.allTimeTotal || 0}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Streak Trend</h4>
        </div>
        <div className="card-content chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streakData}>
              <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
              <YAxis />
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
              <Line type="monotone" dataKey="streak" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MathStudioDisplay;