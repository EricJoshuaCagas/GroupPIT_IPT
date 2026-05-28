import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatWidget } from './components/ChatWidget';
import {
  DashboardPage,
  BorrowersPage,
  LoansPage,
  LoanDetailsPage,
  PaymentsPage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ActivationPage,
  LandingPage,
} from './pages';
import './index.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />
      <Route 
        path="/activate/:uid/:token" 
        element={<ActivationPage />} 
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrowers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BorrowersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loans"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LoansPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loans/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LoanDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ChatWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
