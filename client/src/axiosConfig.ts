// src/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.message === "jwt expired") {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
