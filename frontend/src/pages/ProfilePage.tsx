import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ProfilePage: React.FC = () => {
  const { user, access_token, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    age: user?.age?.toString() || '',
    birthday: user?.birthday || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        age: user.age?.toString() || '',
        birthday: user.birthday || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.birthday && { birthday: formData.birthday }),
        ...(formData.address && { address: formData.address }),
      };

      const response = await fetch('http://localhost:8000/api/auth/profile/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="px-6 py-8 md:px-8">
            <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="h-28 w-28 rounded-full border-4 border-primary-200 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary-200 bg-slate-100 shadow-sm">
                      <svg className="h-14 w-14 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-text-primary">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="mt-1 text-text-secondary">{user.email}</p>
                  {user.is_active ? (
                    <span className="mt-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                      Active
                    </span>
                  ) : (
                    <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-dark">
                      Pending Activation
                    </span>
                  )}
                </div>
              </div>

              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
                <p className="text-sm font-medium text-primary-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input type="email" label="Email Address" value={user.email} disabled className="bg-slate-50" />

              <Input
                type="text"
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                type="text"
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                type="number"
                name="age"
                label="Age"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                type="date"
                name="birthday"
                label="Birthday"
                value={formData.birthday}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-dark">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full rounded-lg border border-border px-4 py-3 text-text-primary placeholder:text-text-secondary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                    !isEditing ? 'cursor-not-allowed bg-slate-50 text-text-secondary' : 'bg-white'
                  }`}
                />
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-secondary">Account ID: {user.id}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={loading} variant="primary">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        age: user.age?.toString() || '',
                        birthday: user.birthday || '',
                        address: user.address || '',
                      });
                    }}
                    variant="secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="primary">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/borrowers"
            className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-text-primary">Borrowers</h3>
                <p className="mt-1 text-sm text-text-secondary">View all borrowers</p>
              </div>
              <span className="absolute inset-y-0 right-0 w-1 translate-x-full bg-primary-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"></span>
            </div>
          </a>

          <a
            href="/loans"
            className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-text-primary">Loans</h3>
                <p className="mt-1 text-sm text-text-secondary">View all loans</p>
              </div>
              <span className="absolute inset-y-0 right-0 w-1 translate-x-full bg-primary-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"></span>
            </div>
          </a>

          <a
            href="/payments"
            className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-text-primary">Payments</h3>
                <p className="mt-1 text-sm text-text-secondary">View all payments</p>
              </div>
              <span className="absolute inset-y-0 right-0 w-1 translate-x-full bg-primary-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"></span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
