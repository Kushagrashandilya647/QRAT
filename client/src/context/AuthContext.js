import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch user profile on mount if token exists
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, role) => {
    await API.post('/auth/register', { name, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    return API.post('/users/auth/reset-password', { email });
  };

  const resetPassword = async (token, password) => {
    return API.post('/users/auth/update-password', { token, password });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, requestPasswordReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
} 