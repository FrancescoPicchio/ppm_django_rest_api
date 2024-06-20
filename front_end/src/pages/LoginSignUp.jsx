import React, { useState } from 'react';
import Login from '../components/Login';
import Registration from '../components/Registration';

const LoginSignUp = ({setIsAuthenticated}) => {
    return (
        <>
            <Login setIsAuthenticated={setIsAuthenticated} />
            <Registration setIsAuthenticated={setIsAuthenticated} />
        </>
    )
};

export default LoginSignUp;