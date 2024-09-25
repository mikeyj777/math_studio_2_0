// client/src/utils/helpers.js

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchStudent = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const fetchStats = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchCurriculum = async (gradeLevel) => {
  try {
    const response = await fetch(`${API_BASE_URL}/curriculum/${gradeLevel}`);
    if (!response.ok) {
      throw new Error('Failed to fetch curriculum');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    throw error;
  }
};

export const updateStats = async (username, isCorrect) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_correct: isCorrect }),
    });
    if (!response.ok) {
      throw new Error('Failed to update stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
};