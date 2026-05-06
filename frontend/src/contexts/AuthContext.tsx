import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age?: number;
  birthday?: string;
  address?: string;
  profile_image?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData | FormData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
  age?: number;
  birthday?: string;
  address?: string;
  profile_image?: File;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tokens and user from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');

    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const { access, refresh } = data;

      // Fetch user profile
      const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userData = await profileResponse.json();

      // Store tokens and user data
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData | FormData) => {
    try {
      // Convert to JSON for registration (exclude profile_image)
      let body: string;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (userData instanceof FormData) {
        // Extract FormData values (excluding file) and convert to JSON
        const jsonData: any = {
          email: userData.get('email'),
          first_name: userData.get('first_name'),
          last_name: userData.get('last_name'),
          password: userData.get('password'),
          re_password: userData.get('re_password'),
        };
        
        // Add optional fields if present
        const age = userData.get('age');
        if (age) jsonData.age = age;
        
        const birthday = userData.get('birthday');
        if (birthday) jsonData.birthday = birthday;
        
        const address = userData.get('address');
        if (address) jsonData.address = address;
        
        body = JSON.stringify(jsonData);
        // Note: profile_image upload would need a separate endpoint
      } else {
        body = JSON.stringify(userData);
      }

      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      // Registration successful - user needs to activate email
      // Don't auto-login, user will need to click activation link
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens and user data
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        access_token,
        refresh_token,
        isAuthenticated: !!access_token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
