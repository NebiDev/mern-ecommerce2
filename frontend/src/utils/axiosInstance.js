// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // this allows Vite's proxy to kick in
  withCredentials: true,
});

export default axiosInstance;
