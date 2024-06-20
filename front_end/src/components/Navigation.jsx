import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = (isA) => {
  return (
    <nav>
      <ul>
        <li><Link to="/questions">Questions</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;