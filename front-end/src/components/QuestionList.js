import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { refreshToken } from '../services/auth';

const API_URL = 'http://localhost:8000/api/polls/questions/';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Try to refresh token
          try {
            await refreshToken();
            // Retry fetching questions
            fetchQuestions();
          } catch (refreshError) {
            setError('Authentication error');
            setLoading(false);
          }
        } else {
          setError('Error fetching questions');
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <h2>{question.question_text}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;