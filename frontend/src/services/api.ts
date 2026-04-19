import axios, { AxiosInstance, AxiosError } from 'axios';
import { Borrower, Loan, Payment } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Borrower API
export const borrowerApi = {
  getAll: () => api.get<{ results: Borrower[] }>('/borrowers/'),
  getById: (id: number) => api.get<Borrower>(`/borrowers/${id}/`),
  create: (data: Omit<Borrower, 'id' | 'created_at'>) =>
    api.post<Borrower>('/borrowers/', data),
  update: (id: number, data: Partial<Borrower>) =>
    api.put<Borrower>(`/borrowers/${id}/`, data),
  delete: (id: number) => api.delete(`/borrowers/${id}/`),
};

// Loan API
export const loanApi = {
  getAll: () => api.get<{ results: Loan[] }>('/loans/'),
  getById: (id: number) => api.get<Loan>(`/loans/${id}/`),
  create: (data: Omit<Loan, 'id' | 'created_at' | 'total_paid' | 'remaining_balance'>) =>
    api.post<Loan>('/loans/', data),
  update: (id: number, data: Partial<Loan>) =>
    api.put<Loan>(`/loans/${id}/`, data),
  delete: (id: number) => api.delete(`/loans/${id}/`),
  getRemainingBalance: (id: number) =>
    api.get<{ remaining_balance: string; total_paid: string; total_payable: string }>(
      `/loans/${id}/remaining-balance/`
    ),
  getPayments: (id: number) => api.get<Payment[]>(`/loans/${id}/payments/`),
};

// Payment API
export const paymentApi = {
  getAll: () => api.get<{ results: Payment[] }>('/payments/'),
  getById: (id: number) => api.get<Payment>(`/payments/${id}/`),
  create: (data: Omit<Payment, 'id' | 'created_at'>) =>
    api.post<Payment>('/payments/', data),
  update: (id: number, data: Partial<Payment>) =>
    api.put<Payment>(`/payments/${id}/`, data),
  delete: (id: number) => api.delete(`/payments/${id}/`),
};

export default api;
