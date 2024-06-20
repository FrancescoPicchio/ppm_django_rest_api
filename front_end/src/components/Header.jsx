import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/auth';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';


const Header = ({ isAuthenticated, setIsAuthenticated }) => {

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    return (
        <nav>
            <ul>
                <li><Link to="/questions">Content</Link></li>
                <li>{!(isAuthenticated) && <Link to="/">Login/SignUp</Link>}</li>
                <li>{isAuthenticated && <button onClick={handleLogout}>Logout</button>}</li>
            </ul>
        </nav>
    );
};

export default Header;