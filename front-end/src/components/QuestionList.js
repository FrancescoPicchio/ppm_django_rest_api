import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { refreshToken } from '../services/auth';
import {fetchQuestionList, fetchQuestionDetails, submitQuestionVote} from '../services/api';

const API_URL = 'http://localhost:8000/api/polls/questions/';

//returns all the questions in the database
const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestionList = async () => {
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
            fetchQuestionList();
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

    fetchQuestionList();
  }, []);

  //gets question details on click
  const handleQuestionClick = async (questionId) => {
    try {
      const data = await fetchQuestionDetails(questionId);
      setSelectedQuestion(data);
    } catch (err) {
      console.error('Error fetching question details:', err);
      if (err.response && err.response.status === 401) {
        try {
          await refreshToken();
          handleQuestionClick(questionId);
        } catch (refreshError) {
          setError('Authentication error');
        }
      } else {
        setError('Error fetching question details');
      }
    }
  };

  //adds a vote to a choice in the poll
  const handleChoiceClick = async (questionId, choiceId) => {
    try {
        const data = await submitQuestionVote(questionId, choiceId);
        handleQuestionClick(questionId);
      } catch (err) {
        console.error('Error submitting your vote:', err);
        if (err.response && err.response.status === 401) {
          try {
            await refreshToken();
            handleChoiceClick(questionId);
          } catch (refreshError) {
            setError('Authentication error');
          }
        } 
        else if (err.response && err.response.status === 403){
            setError("You've already voted on this poll"); //FIXME application shouldn't crash/give you an error just because you tried to vote when you voted already
        }
        else {
          setError('Error submitting your vote');
        }
      }
  }

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      {selectedQuestion ? (
        <div>
          {error && <p>{error}</p>}
          <h2>{selectedQuestion.question_text}</h2>
          <ul>
            {selectedQuestion.choices.map((choice) => (
                <li key={choice.id} onClick={() => handleChoiceClick(selectedQuestion.id, choice.id)}>{choice.choice_text} - votes: {choice.votes}</li>
            ))}
          </ul>
          <p>author: {selectedQuestion.creator}</p>
          <button onClick={() => {setSelectedQuestion(null); setError(null)}}>Back to List</button>
        </div>
      ) : (
        <div>
          <h1>Questions</h1>
          {error && <p>{error}</p>}
          <ul>
            {questions.map((question) => (
              <li key={question.id} onClick={() => handleQuestionClick(question.id)}>
                <h2>{question.question_text}</h2>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionList;