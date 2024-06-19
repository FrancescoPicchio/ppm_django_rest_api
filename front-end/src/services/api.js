import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const fetchQuestionList = async () => {
  try {
    const response = await axios.get(`${API_URL}polls/questions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const fetchQuestionDetails = async (questionId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}polls/questions/${questionId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching question details:', error);
      throw error;
    }
  };