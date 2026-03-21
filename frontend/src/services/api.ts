import axios, { AxiosInstance } from 'axios';
import { Borrower, Loan, Payment } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
