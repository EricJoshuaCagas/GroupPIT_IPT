import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setSuccessMessage(state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed. Please check your credentials.';

      if (errorMsg.includes('is_active') || errorMsg.includes('not active')) {
        setError('Your account is not activated. Please check your email for the activation link.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
        <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-text-primary">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                <p className="text-sm font-medium text-primary-700">{successMessage}</p>
              </div>
            )}

            <div className="space-y-2">
              <Input
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
