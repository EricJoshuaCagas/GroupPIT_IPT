import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { Loan, PagedResponse, UserProfile, Borrower, Payment, DashboardStats } from '../types';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        await AsyncStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access: string; refresh: string }>('/auth/login/', { email, password }),
  register: (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    re_password: string;
  }) => api.post('/auth/register/', payload),
  profile: () => api.get<UserProfile>('/auth/profile/'),
  updateProfile: (payload: Partial<UserProfile>) => api.patch<UserProfile>('/auth/profile/update/', payload),
};

export const chatApi = {
  sendMessage: (message: string) => api.post<{ response: string }>('/v1/chat/', { message }),
};

// Borrower API
export const borrowerApi = {
  getAll: () => api.get<PagedResponse<Borrower>>('/borrowers/'),
  getById: (id: number) => api.get<Borrower>(`/borrowers/${id}/`),
  create: (data: Omit<Borrower, 'id' | 'created_at'>) =>
    api.post<Borrower>('/borrowers/', data),
  update: (id: number, data: Partial<Borrower>) =>
    api.put<Borrower>(`/borrowers/${id}/`, data),
  delete: (id: number) => api.delete(`/borrowers/${id}/`),
};

// Loan API
export const loanApi = {
  getAll: () => api.get<PagedResponse<Loan>>('/loans/'),
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
  getPayments: (id: number) => api.get<PagedResponse<Payment>>(`/loans/${id}/payments/`),
};

// Payment API
export const paymentApi = {
  getAll: () => api.get<PagedResponse<Payment>>('/payments/'),
  getById: (id: number) => api.get<Payment>(`/payments/${id}/`),
  create: (data: Omit<Payment, 'id' | 'created_at'>) =>
    api.post<Payment>('/payments/', data),
  update: (id: number, data: Partial<Payment>) =>
    api.put<Payment>(`/payments/${id}/`, data),
  delete: (id: number) => api.delete(`/payments/${id}/`),
};

// Dashboard/Stats API
export const dataApi = {
  borrowers: () => api.get<PagedResponse<Borrower>>('/borrowers/'),
  loans: () => api.get<PagedResponse<Loan>>('/loans/'),
  payments: () => api.get<PagedResponse<Payment>>('/payments/'),
  stats: () => api.get<DashboardStats>('/dashboard/stats/'),
};
