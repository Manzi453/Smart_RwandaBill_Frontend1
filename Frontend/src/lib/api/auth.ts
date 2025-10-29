import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8080/api/auth';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles?: string[];
}

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Sign up a new user
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/signup', {
        ...userData,
        roles: userData.roles || ['user']
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  // Login with email/phone and password
  login: async (credentials: { email?: string; phoneNumber?: string; password: string }): Promise<AuthResponse> => {
    try {
      const requestData = {
        ...(credentials.email ? { email: credentials.email } : {}),
        ...(credentials.phoneNumber ? { phoneNumber: credentials.phoneNumber } : {}),
        password: credentials.password
      };
      
      const response = await api.post<AuthResponse>('/api/auth/signin', requestData);
      
      // Store the token and user data in local storage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          telephone: response.data.telephone,
          district: response.data.district,
          sector: response.data.sector,
          roles: response.data.roles
        }));
      }
      
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  // Get current user from local storage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Check if user has required role
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// Export the configured axios instance for other API calls
export default api;
