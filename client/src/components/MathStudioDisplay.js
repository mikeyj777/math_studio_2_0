import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MathEngine from './MathEngine';
import * as helpers from '../utils/helpers';

const MathStudioDisplay = () => {
  const { userId } = useParams();
  const [answer, setAnswer] = useState('');
  const [streakData, setStreakData] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [stats, setStats] = useState(null);
  const [problem, setProblem] = useState(null);
  const [message, setMessage] = useState('');
  const [mathEngine, setMathEngine] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'));
  const { name, grade_level: gradeLevelForDisplay, special_education: specialEducation } = userData;

  const gradeLevel = specialEducation ? 'special_education' : gradeLevelForDisplay;

  const fetchLatestStats = async () => {
    try {
      const latestStats = await helpers.fetchStats(userId);
      setStats(latestStats);
    } catch (error) {
      console.error('Error fetching latest stats:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curriculumData, statsData] = await Promise.all([
          helpers.fetchCurriculum(gradeLevel),
          helpers.fetchStats(userId)
        ]);
        setCurriculum(curriculumData.curriculum);
        setStats(statsData);
        setMathEngine(new MathEngine(curriculumData.curriculum));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, gradeLevel]);

  useEffect(() => {
    if (mathEngine) {
      setProblem(mathEngine.generateProblem());
    }
  }, [mathEngine]);

  useEffect(() => {
    if (stats) {
      setStreakData(prevData => [
        ...prevData,
        { time: new Date().getTime(), streak: stats.currentStreak }
      ]);
    }
  }, [stats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedAnswer = answer.trim();
    
    if (!trimmedAnswer) {
      setMessage("Please enter an answer before submitting.");
      return;
    }

    if (problem) {
      try {
        const result = await helpers.onAnswer(
          userId, 
          trimmedAnswer,
          problem.answer,
          helpers.updateStats,
          () => mathEngine.generateProblem()
        );
        
        await fetchLatestStats();
        
        setProblem(result.newProblem);
        setAnswer('');
        setMessage(result.message);
        setSessionTotal(sessionTotal + 1);
        if (result.isCorrect) {
          setSessionCorrect(sessionCorrect + 1);
        }
      } catch (error) {
        console.error('Error processing answer:', error);
        setMessage("An error occurred while processing your answer. Please try again.");
      }
    }
  };

  const renderMathSymbols = (text) => {
    return text.replace(/\^(\d+)/g, '<sup>$1</sup>')
               .replace(/√/g, '&radic;')
               .replace(/π/g, '&pi;')
               .replace(/≥/g, '&ge;')
               .replace(/≤/g, '&le;')
               .replace(/∞/g, '&infin;')
               .replace(/(\d+)\/(\d+)/g, '<sup>$1</sup>&frasl;<sub>$2</sub>');
  };

  if (!curriculum || !stats || !problem) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="math-studio-container">
      <div className="card">
        <div className="card-header">
          <h2>{name || 'Student'} - Grade {gradeLevelForDisplay || 'N/A'}</h2>
        </div>
        <div className="card-content">
          <h3>Problem:</h3>
          <p dangerouslySetInnerHTML={{ __html: renderMathSymbols(problem.question || 'Loading problem...') }}></p>
          {message && <p className="message">{message}</p>}
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
            <p className="stat-value">{sessionCorrect || 0} / {sessionTotal || 0}</p>
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
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <LineChart data={streakData}>
              <XAxis 
                dataKey="time" 
                type="number" 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} 
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
              <Line type="monotone" dataKey="streak" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default MathStudioDisplay;