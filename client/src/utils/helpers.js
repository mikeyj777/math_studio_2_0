// client/src/utils/helpers.js

export const fetchStudent = async () => {
  // This should be replaced with an actual API call
  return { name: "John Doe", grade_level: "6" };
};

export const fetchStats = async () => {
  // This should be replaced with an actual API call
  return {
    currentStreak: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    allTimeCorrect: 0,
    allTimeTotal: 0
  };
};

export const fetchCurriculum = async (gradeLevel) => {
  // This should be replaced with an actual API call
  return {
    addition: 100,
    subtraction: 100,
    multiplication: 12,
    division: 12,
    geometry: 1,
    algebra: -1,
    algebra2: -1,
    precalculus: -1,
    calculus: -1
  };
};

export const updateStats = (prevStats, isCorrect) => {
  return {
    ...prevStats,
    currentStreak: isCorrect ? prevStats.currentStreak + 1 : 0,
    sessionCorrect: isCorrect ? prevStats.sessionCorrect + 1 : prevStats.sessionCorrect,
    sessionTotal: prevStats.sessionTotal + 1,
    allTimeCorrect: isCorrect ? prevStats.allTimeCorrect + 1 : prevStats.allTimeCorrect,
    allTimeTotal: prevStats.allTimeTotal + 1
  };
};