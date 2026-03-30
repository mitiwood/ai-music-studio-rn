import axios from 'axios';
import {API_BASE} from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.response.use(
  res => res,
  error => {
    console.warn('[API]', error.config?.url, error.message);
    return Promise.reject(error);
  },
);

export default api;
