import React, { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import QuestionList from './components/QuestionList';
import { logout } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('accessToken')
  );

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
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
    </div>
  );
}

export default App;