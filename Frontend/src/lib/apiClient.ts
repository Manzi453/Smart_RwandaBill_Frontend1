// @ts-ignore
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken, clearAuthToken, setAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refreshtoken`, {}, {
          withCredentials: true
        });
        
        const { accessToken } = response.data;
        setAuthToken(accessToken);
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (error) {
        // If refresh token fails, log the user out
        clearAuthToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post('/auth/signin', credentials),
    
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles?: string[];
  }) => apiClient.post('/auth/signup', userData),
  
  logout: () => apiClient.post('/auth/signout'),
  
  refreshToken: () =>
    apiClient.post('/auth/refreshtoken'),
    
  verifyEmail: (token: string) =>
    apiClient.post(`/auth/verify-email?token=${token}`),
    
  requestPasswordReset: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
    
  resetPassword: (data: { token: string; newPassword: string; confirmPassword: string }) =>
    apiClient.post('/auth/reset-password', data),
    
  resendVerificationEmail: (email: string) =>
    apiClient.post('/auth/resend-verification', { email })
};

// Users API
export const usersApi = {
  getCurrentUser: () =>
    apiClient.get('/users/me'),
    
  updateProfile: (userId: string, userData: any) =>
    apiClient.put(`/users/${userId}`, userData),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/users/change-password', data),
    
  // Admin only
  getAllUsers: (params?: { page?: number; size?: number; sort?: string }) =>
    apiClient.get('/users', { params }),
    
  getUserById: (userId: string) =>
    apiClient.get(`/users/${userId}`),
    
  updateUser: (userId: string, userData: any) =>
    apiClient.put(`/users/${userId}`, userData),
    
  deleteUser: (userId: string) =>
    apiClient.delete(`/users/${userId}`)
};

// Water Meters API
export const waterMetersApi = {
  getAllMeters: (params?: { page?: number; size?: number; userId?: string }) =>
    apiClient.get('/water-meters', { params }),
    
  getMeterById: (meterId: string) =>
    apiClient.get(`/water-meters/${meterId}`),
    
  createMeter: (meterData: any) =>
    apiClient.post('/water-meters', meterData),
    
  updateMeter: (meterId: string, meterData: any) =>
    apiClient.put(`/water-meters/${meterId}`, meterData),
    
  deleteMeter: (meterId: string) =>
    apiClient.delete(`/water-meters/${meterId}`),
    
  getMeterReadings: (meterId: string, params?: { page?: number; size?: number }) =>
    apiClient.get(`/water-meters/${meterId}/readings`, { params }),
    
  addMeterReading: (meterId: string, readingData: any) =>
    apiClient.post(`/water-meters/${meterId}/readings`, readingData)
};

// Billings API
export const billingsApi = {
  getAllBillings: (params?: { 
    page?: number; 
    size?: number; 
    userId?: string; 
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/billings', { params }),
  
  getBillingById: (billingId: string) =>
    apiClient.get(`/billings/${billingId}`),
    
  createBilling: (billingData: any) =>
    apiClient.post('/billings', billingData),
    
  updateBilling: (billingId: string, billingData: any) =>
    apiClient.put(`/billings/${billingId}`, billingData),
    
  deleteBilling: (billingId: string) =>
    apiClient.delete(`/billings/${billingId}`),
    
  generateBill: (billingData: any) =>
    apiClient.post('/billings/generate', billingData)
};

// Payments API
export const paymentsApi = {
  getAllPayments: (params?: { 
    page?: number; 
    size?: number; 
    userId?: string; 
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/payments', { params }),
  
  getPaymentById: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}`),
    
  createPayment: (paymentData: any) =>
    apiClient.post('/payments', paymentData),
    
  processPayment: (paymentId: string) =>
    apiClient.post(`/payments/${paymentId}/process`),
    
  getPaymentHistory: (userId: string, params?: { page?: number; size?: number }) =>
    apiClient.get(`/users/${userId}/payments`, { params })
};

// Reports API
export const reportsApi = {
  getRevenueReport: (params: { 
    startDate: string; 
    endDate: string; 
    groupBy: 'day' | 'week' | 'month';
  }) => apiClient.get('/reports/revenue', { params }),
  
  getUsageReport: (params: {
    startDate: string;
    endDate: string;
    meterId?: string;
    userId?: string;
  }) => apiClient.get('/reports/usage', { params }),
  
  getPaymentStatusReport: (params: {
    startDate: string;
    endDate: string;
    status?: string;
  }) => apiClient.get('/reports/payment-status', { params })
};

export default apiClient;
