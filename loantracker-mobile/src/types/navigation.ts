export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Dashboard: undefined;
  Loans: undefined;
  Borrowers: undefined;
  Payments: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  ChatAssistant: undefined;
  LoanDetails: { id: number };
  CreateLoan: { loanId?: number } | undefined;
};
