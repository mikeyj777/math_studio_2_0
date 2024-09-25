import React, { useState, useEffect } from 'react';
import MathEngine from './components/MathEngine';
import MathStudioDisplay from './components/MathStudioDisplay';
import { fetchStudent, fetchStats, fetchCurriculum, updateStats } from './utils/helpers';
import './styles/App.css';
import './styles/CommonStyles.css';

function App() {
  const [student, setStudent] = useState(null);
  const [problem, setProblem] = useState(null);
  const [stats, setStats] = useState(null);
  const [mathEngine, setMathEngine] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      const fetchedStudent = await fetchStudent();
      setStudent(fetchedStudent);
      const fetchedStats = await fetchStats();
      setStats(fetchedStats);
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (student) {
      fetchCurriculum(student.grade_level).then(curriculum => {
        setMathEngine(new MathEngine(curriculum));
      });
    }
  }, [student]);

  useEffect(() => {
    if (mathEngine) {
      setProblem(mathEngine.generateProblem());
    }
  }, [mathEngine]);

  const handleAnswer = (answer) => {
    if (problem && mathEngine) {
      const isCorrect = answer === problem.answer.toString();
      setStats(prevStats => updateStats(prevStats, isCorrect));
      setProblem(mathEngine.generateProblem());
      // Here you would also make an API call to update the stats in the backend
    }
  };

  return (
    <div className="App">
      {student && problem && stats && (
        <MathStudioDisplay
          student={student}
          problem={problem}
          stats={stats}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

export default App;