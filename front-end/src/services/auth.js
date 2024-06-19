// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}token/`, {
      username,
      password
    });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, email, password, password2) => {
  try{
    const response = await axios.post(`${API_URL}register/`, {
      username, email, password, password2
    });
    return  response.data.access;
    } catch (error) {
      throw error;
    }
}

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_URL}token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem('accessToken', response.data.access);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};