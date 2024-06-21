import React, { useEffect, useState } from 'react';
import LoginSignUp from './pages/LoginSignUp';
import QuestionList from './components/QuestionList';
import Header from './components/Header';
import NewQuestionCreator from './components/NewQuestionCreator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
      !!localStorage.getItem('accessToken')
  );
  

  return (
    <div className="App">
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <Routes>
          <Route path="" element={isAuthenticated ? <QuestionList/> : <LoginSignUp setIsAuthenticated={setIsAuthenticated}/>}/>
          <Route path="/questions" element={isAuthenticated ? <QuestionList/> : 
            <>
              <p>Login or Sign Up to see the polls!</p>
                <LoginSignUp setIsAuthenticated={setIsAuthenticated}/>
              </>
          }/>
          <Route path="/createNewQuestion" element={<NewQuestionCreator/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
  <Route path="/authentication" element={<LoginSignUp setIsAuthenticated={setIsAuthenticated}/>}/>
*/

/*
  <header className="App-header">
        <h1>My React and Django App</h1>
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      </header>
      <main>
        {isAuthenticated ? (
          <QuestionList />
        ) : (
          <>
          <Login setIsAuthenticated={setIsAuthenticated} />
          <Registration setIsAuthenticated={setIsAuthenticated} />
          </>
        )}
      </main>  
*/