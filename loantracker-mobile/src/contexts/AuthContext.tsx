import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    re_password: string;
  }) => Promise<void>;
  updateProfile: (payload: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const saveUser = async (nextUser: UserProfile) => {
    await AsyncStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const refreshProfile = async () => {
    const profileResponse = await authApi.profile();
    await saveUser(profileResponse.data);
    return profileResponse.data as UserProfile;
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { access, refresh } = response.data;
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);

    await refreshProfile();
  };

  const register = async (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    re_password: string;
  }) => {
    await authApi.register(payload);
  };

  const updateProfile = async (payload: Partial<UserProfile>) => {
    const response = await authApi.updateProfile(payload);
    await saveUser(response.data);
    return response.data as UserProfile;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
