// client/src/utils/helpers.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

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

export const fetchStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${userId}`);
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
    // const response = await fetch(`${API_BASE_URL}/curriculum/${gradeLevel}`);
    console.log('about to get curriculum');
    console.log("full url as interpreted by react is " + `${API_BASE_URL}/api/curriculum`);
    const response = await axios.get(`${API_BASE_URL}/api/curriculum/${gradeLevel}`);
    const curriculum = response.data.curriculum;
    console.log('got curriculum: ' + curriculum);
    return curriculum;
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
  // get curriculum
  