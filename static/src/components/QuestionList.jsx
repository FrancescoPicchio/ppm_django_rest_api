import React, { useEffect, useState } from 'react';
import { refreshToken } from '../services/auth';
import {fetchQuestionList, fetchQuestionDetails, submitQuestionVote, deleteQuestion} from '../services/api';

const API_URL = 'http://localhost:8000/api/polls/questions/';

//returns all the questions in the database
const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('before fetching');
        const data = await fetchQuestionList();
        console.log('questions fetched');
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
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
            setError("You've already voted on this poll!"); //FIXME application shouldn't crash/give you an error just because you tried to vote when you voted already
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
          <h3>{selectedQuestion.question_text}</h3>
          {error && <p>{error}</p>}
          <ul>
            {selectedQuestion.choices.map((choice) => (
                <li key={choice.id} onClick={() => handleChoiceClick(selectedQuestion.id, choice.id)}>{choice.choice_text} - votes: {choice.votes}</li>
            ))}
          </ul>
          <p>Click on the choice you want to vote it!</p>
          <p>author: {selectedQuestion.creator}</p>
          {(selectedQuestion.creator === localStorage.getItem('username'))
              && <button onClick={() => {deleteQuestion(selectedQuestion.id); setSelectedQuestion(null)/*FIXME when deleted the question still remains unless you refresh*/}}>
                Delete your poll</button>}
          <button onClick={() => {setSelectedQuestion(null); setError(null)}}>Back to List</button>
        </div>
      ) : (
        <div>
          {error && <p>{error}</p>}
          <ul>
            {questions.map((question) => (
              <li key={question.id} onClick={() => handleQuestionClick(question.id)}>
                <h3>{question.question_text}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionList;