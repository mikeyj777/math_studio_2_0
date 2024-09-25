import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MathStudioDisplay = ({ student = {}, problem = {}, onAnswer, stats = {} }) => {
  const [answer, setAnswer] = useState('');
  const [streakData, setStreakData] = useState([]);

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