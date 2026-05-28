import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const ActivationPage: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'already-active' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      if (!uid || !token) {
        setStatus('error');
        setMessage('Invalid activation link. Missing parameters.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/auth/activate/${uid}/${token}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (data.message?.toLowerCase().includes('already active')) {
            setStatus('already-active');
            setMessage('Your account is already active. Redirecting to login...');
          } else {
            setStatus('success');
            setMessage(data.message || 'Your account has been activated successfully!');
          }
          setTimeout(() => {
            navigate('/login', { state: { message: 'You can now log in with your credentials.' } });
          }, 3000);
        } else {
          setStatus('error');
          setMessage(
            data.message ||
              'Activation failed. The link may have expired or is invalid. Please try registering again.'
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during activation. Please try again or contact support.');
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
        <div className="w-full space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              {status === 'loading' ? 'Activating Account...' : 'Account Activation'}
            </h2>
          </div>

          <div className="flex justify-center">
            {status === 'loading' && (
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500"></div>
            )}
            {(status === 'success' || status === 'already-active') && (
              <div className="rounded-full bg-primary-50 p-3">
                <svg className="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-slate-50 p-6 text-center">
            <p
              className={`text-base font-medium ${
                status === 'success' || status === 'already-active'
                  ? 'text-primary-700'
                  : status === 'error'
                    ? 'text-red-700'
                    : 'text-slate-dark'
              }`}
            >
              {message}
            </p>
          </div>

          <div className="space-y-3">
            {(status === 'success' || status === 'already-active') && (
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            )}

            {status === 'error' && (
              <>
                <Button onClick={() => window.location.reload()} className="w-full" variant="primary">
                  Try Again
                </Button>
                <div className="text-center">
                  <p className="mb-2 text-sm text-text-secondary">Didn&apos;t receive the email?</p>
                  <Link to="/register" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
                    Register again
                  </Link>
                </div>
              </>
            )}

            {status === 'loading' && (
              <Button disabled className="w-full">
                Please wait...
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-text-secondary">
            <Link to="/login" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
