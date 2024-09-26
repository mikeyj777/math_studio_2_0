import axios from 'axios';
import Fuse from 'fuse.js';
import { correctResponses, incorrectResponses } from './answer_responses';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const loginUser = async (username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const fetchCurriculum = async (gradeLevel) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/curriculum/${gradeLevel}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    throw error;
  }
};

export const fetchStats = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const updateStats = async (userId, isCorrect) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stats/${userId}`, { is_correct: isCorrect });
    console.log('Stats update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
};

export const onAnswer = async (userId, answer, correctAnswer, updateStats, updateProblem) => {
  const fuse = new Fuse([correctAnswer.toString()], {
    includeScore: true,
    threshold: 0.3 // Adjust this value to make the matching more or less strict
  });

  const result = fuse.search(answer);
  const isCorrect = result.length > 0 && result[0].score < 0.3;

  let message = '';
  if (isCorrect) {
    message = correctResponses[Math.floor(Math.random() * correctResponses.length)];
  } else {
    message = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
    message += ` The correct answer is ${correctAnswer}.`;
  }

  try {
    // Update stats in the backend
    const updatedStats = await updateStats(userId, isCorrect);
    
    // Generate a new problem
    const newProblem = updateProblem();

    return {
      message,
      updatedStats,
      newProblem
    };
  } catch (error) {
    console.error('Error updating answer:', error);
    throw error;
  }
};

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}