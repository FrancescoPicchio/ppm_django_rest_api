import React, { useEffect, useState } from 'react';
import { fetchQuestionDetails, createNewQuestion, createNewOption} from '../services/api';
import { useNavigate } from 'react-router-dom';

const NewQuestionCreator = () => {
    const [inputText, setInputText] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [questionId, setQuestionId] = useState(null);
    const [error, setError] = useState(null);
    const [choices, setChoices] = useState([]);
    const [inputChoice, setInputChoice] = useState("");

    let navigate = useNavigate(); 
    const routeChange = () =>{  
        navigate('/');
  }

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const now = new Date();
            const currentDate = now.toISOString();
            const response = await createNewQuestion(inputText, currentDate);
            setQuestionText(inputText);
            setQuestionId(response.data.id)
            return;
        } catch (err) {
          setError('Error creating new question');
    }
    };

    const handleChoiceSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createNewOption(questionId, inputChoice);
            setChoices([...choices, response.data]);
            setInputChoice("");
            return;
        } catch (err) {
          setError('Error creating new question');
    }
    };


    return (
    <>
        {error && <p>{error}</p>}
        {questionText ?
        (<>
            <h3> Your Question: {questionText}</h3>
                {choices && <><ul>
                {choices.map((choice) => (
                    <li key={choice.id}>{choice.choice_text}</li>
                ))}
            </ul>
            <form onSubmit={handleChoiceSubmit}>
            <div>
                <label>Submit a choice for your poll: </label>
                <input
                    type="text"
                    value={inputChoice}
                    onChange={(e) => setInputChoice(e.target.value)}
                />
            </div>
            <button type="submit">Submit new Choice</button>
            </form>
            <button onClick={() => {routeChange()}}>Back to Questions</button>
        </>
          }
        </>) :
        (
        <form onSubmit={handleQuestionSubmit}>
            <div>
                <label>Submit your poll's question text: </label>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
        )
        }
    </>
    );
}

export default NewQuestionCreator;