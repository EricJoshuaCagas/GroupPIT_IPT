export interface Borrower {
  id: number;
  full_name: string;
  contact_number: string;
  email: string;
  address: string;
  created_at: string;
}

export interface Payment {
  id: number;
  loan: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  notes?: string;
  created_at: string;
}

export interface Loan {
  id: number;
  borrower: number;
  borrower_name: string;
  principal_amount: string;
  interest_rate: string;
  total_payable: string;
  term_months: number;
  start_date: string;
  due_date: string;
  status: 'active' | 'completed' | 'overdue';
  total_paid: string;
  remaining_balance: string;
  created_at: string;
  payments?: Payment[];
}

export interface DashboardStats {
  total_borrowers: number;
  total_loans: number;
  total_payments: number;
  recent_transactions: Payment[];
}

export interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
  detail?: string;
}
