import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/auth';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    return (
        <nav>
            <ul>
                <li><Link to='/questions'>Questions</Link></li>
                { isAuthenticated && <li><Link to='/createNewQuestion'>Create new Poll</Link></li>}
                <li>{(!isAuthenticated) ? <Link to='/'>Login/SignUp</Link> : <p>You're logged in as {localStorage.getItem('username')}</p>}</li>
                {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
            <h1>Polls App, using Django REST API and React</h1>
        </nav>
    );
};

export default Header;