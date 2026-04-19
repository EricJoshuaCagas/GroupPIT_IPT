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
      // Optionally, refetch user data or update context
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <Button
                onClick={handleLogout}
                variant="secondary"
              >
                Logout
              </Button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <Input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Account Created */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Account ID: {user.id}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    variant="primary"
                  >
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
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/borrowers"
            className="relative group block w-full overflow-hidden rounded-lg border border-gray-200 p-4 transition hover:shadow-lg"
          >
            <div className="sm:flex sm:justify-between sm:items-center">
              <div>
                <h3 className="font-bold text-gray-900">Borrowers</h3>
                <p className="mt-1 text-sm text-gray-600">View all borrowers</p>
              </div>
              <span className="absolute inset-y-0 right-0 translate-x-full transition group-hover:translate-x-0 group-hover:bg-blue-600 w-1 bg-blue-600 opacity-0 group-hover:opacity-100"></span>
            </div>
          </a>

          <a
            href="/loans"
            className="relative group block w-full overflow-hidden rounded-lg border border-gray-200 p-4 transition hover:shadow-lg"
          >
            <div className="sm:flex sm:justify-between sm:items-center">
              <div>
                <h3 className="font-bold text-gray-900">Loans</h3>
                <p className="mt-1 text-sm text-gray-600">View all loans</p>
              </div>
              <span className="absolute inset-y-0 right-0 translate-x-full transition group-hover:translate-x-0 group-hover:bg-blue-600 w-1 bg-blue-600 opacity-0 group-hover:opacity-100"></span>
            </div>
          </a>

          <a
            href="/payments"
            className="relative group block w-full overflow-hidden rounded-lg border border-gray-200 p-4 transition hover:shadow-lg"
          >
            <div className="sm:flex sm:justify-between sm:items-center">
              <div>
                <h3 className="font-bold text-gray-900">Payments</h3>
                <p className="mt-1 text-sm text-gray-600">View all payments</p>
              </div>
              <span className="absolute inset-y-0 right-0 translate-x-full transition group-hover:translate-x-0 group-hover:bg-blue-600 w-1 bg-blue-600 opacity-0 group-hover:opacity-100"></span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
