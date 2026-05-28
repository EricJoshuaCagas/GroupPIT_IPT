import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    birthday: '',
    address: '',
    profile_image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthdate: string): number | null => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profile_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const jsonData: any = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        re_password: formData.password2,
      };

      if (formData.birthday) {
        const age = calculateAge(formData.birthday);
        if (age !== null && age >= 18) {
          jsonData.age = age;
          jsonData.birthday = formData.birthday;
        } else if (age !== null && age < 18) {
          setError('You must be at least 18 years old');
          setLoading(false);
          return;
        }
      }

      if (formData.address) {
        jsonData.address = formData.address;
      }

      await register(jsonData);
      navigate('/login', { state: { message: 'Registration successful! Check your email to activate your account.' } });
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      try {
        const errorObj = JSON.parse(errorMsg);
        const firstError = Object.values(errorObj)[0];
        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else {
          setError(String(firstError));
        }
      } catch {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="profile_image" className="mb-2 block text-sm font-semibold text-slate-dark">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full border-2 border-primary-200 object-cover"
                  />
                )}
                <div className="flex-1">
                  <input
                    id="profile_image"
                    name="profile_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border file:border-primary-200 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="mt-1 text-xs text-text-secondary">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="first_name"
                name="first_name"
                label="First Name *"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                required
              />

              <Input
                id="last_name"
                name="last_name"
                label="Last Name *"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              label="Email *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <div>
              <Input
                id="birthday"
                name="birthday"
                label="Birthday *"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
              {formData.birthday && calculateAge(formData.birthday) !== null && (
                <p className="mt-1 text-sm text-text-secondary">Age: {calculateAge(formData.birthday)} years old</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-semibold text-slate-dark">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State ZIP"
                rows={3}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-text-primary placeholder:text-text-secondary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <Input
                id="password"
                name="password"
                label="Password *"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
              <p className="-mt-2 text-xs text-text-secondary">Minimum 8 characters</p>
            </div>

            <Input
              id="password2"
              name="password2"
              label="Confirm Password *"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              placeholder="********"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
