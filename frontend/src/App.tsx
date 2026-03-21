import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import {
  DashboardPage,
  BorrowersPage,
  LoansPage,
  LoanDetailsPage,
  PaymentsPage,
} from './pages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/borrowers" element={<BorrowersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/loans/:id" element={<LoanDetailsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
