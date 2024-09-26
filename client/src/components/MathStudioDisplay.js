import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MathEngine from './MathEngine';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import * as helpers from '../utils/helpers';

const MathStudioDisplay = ({ onAnswer}) => {
  const [answer, setAnswer] = useState('');
  const [streakData, setStreakData] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [stats, setStats] = useState(null);
  const [problem, setProblem] = useState(null);

  console.log("on answer is " + onAnswer)
  //  get user data
  const name = helpers.toTitleCase(localStorage.getItem('name'));
  const userId = localStorage.getItem('userId');
  const gradeLevelForDisplay = localStorage.getItem('grade_level');
  const specialEducation = localStorage.getItem('special_education') === 'true';

  //  determine if user is in special ed
  const gradeLevel = specialEducation ? 'special_education' : gradeLevelForDisplay;
  
  console.log("from math studio display")
  console.log("user id is " + userId)
  console.log("grade level is " + gradeLevel)
  console.log("special education is " + specialEducation)

  // Fetch curriculum data asynchronously and store in state
   // Fetch curriculum data asynchronously
  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        const curriculumData = await helpers.fetchCurriculum(gradeLevel);
        setCurriculum(curriculumData.curriculum); // Set curriculum in state
      } catch (error) {
        console.error('Error fetching curriculum:', error);
      }
    };

    fetchCurriculumData();
  }, [gradeLevel]);

  // Fetch stats data asynchronously
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const statsData = await helpers.fetchStats(userId);
        setStats(statsData);  // Set the stats in state after fetching
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchUserStats();
  }, [userId]);

  // Update streakData when stats are fetched and currentStreak exists
  useEffect(() => {
    if (stats && stats.currentStreak !== undefined) {
      setStreakData(prevData => [
        ...prevData,
        { time: new Date().getTime(), streak: stats.currentStreak }
      ]);
    }
  }, [stats]);

  // Generate the problem once the curriculum is fetched
  useEffect(() => {
    if (curriculum) {
      const me = new MathEngine(curriculum);
      const generatedProblem = me.generateProblem();
      setProblem(generatedProblem);  // Store the generated problem in state
    }
  }, [curriculum]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAnswer) onAnswer(answer);
    setAnswer('');
  };

  if (!curriculum || !stats || !problem) {
    return <div>Loading...</div>; // Render a loading state until everything is ready
  }

  return (
    <div className="math-studio-container">
      <div className="card">
        <div className="card-header">
          <h2>{name || 'Student'} - Grade {gradeLevelForDisplay || 'N/A'}</h2>
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