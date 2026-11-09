import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/backend',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sweety_token');

  if (token) {
    config.headers['X-Sweety-Token'] = token;
  }

  return config;
});

export default api;
