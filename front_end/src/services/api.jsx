import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const fetchQuestionList = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}polls/questions/` , 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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

export const deleteQuestion = async (questionId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}polls/questions/${questionId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};


export const createNewQuestion = async (questionText, currentDate) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}polls/questions/`,
      {
        question_text: questionText,
        pub_date: currentDate
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    );
    return response;   
  } catch (error) {
    console.error('Error creating a new question')
  }
};

export const createNewOption = async (questionId, choiceText) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}polls/questions/${questionId}/choices/`,
        { choice_text: choiceText },
        { headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
    return response;   
  } catch (error) {
    console.error('Error adding a new choice to question')
  }
};

export const submitQuestionVote = async (questionId, choiceId) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.patch(`${API_URL}polls/questions/${questionId}/vote/`,
            { choice_id: choiceId }, 
            { headers: {
                Authorization: `Bearer ${accessToken}`,
          },
        });
  
        return response.data;
      } catch (error) {
        console.error('Error fetching question details:', error);
        throw error;
      }
}

