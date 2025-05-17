import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth.types';

const API_URL = 'http://localhost:3001/auth';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/register', credentials);
    return response.data;
  },

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  },

  getToken(): string | null {
    return sessionStorage.getItem('token');
  },

  removeToken() {
    sessionStorage.removeItem('token');
  }
}; 