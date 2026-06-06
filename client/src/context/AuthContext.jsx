import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = '/api';

// Create axios instance
const api = axios.create({ baseURL: API_BASE });

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('globist_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('globist_token');
      localStorage.removeItem('globist_user');
    }
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('globist_token');
    const savedUser = localStorage.getItem('globist_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (data) => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  };

  const verifyOtp = async (data) => {
    const res = await api.post('/auth/verify-otp', data);
    const { accessToken, user: userData } = res.data;
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('globist_token', accessToken);
    localStorage.setItem('globist_user', JSON.stringify(userData));
    return res.data;
  };

  const login = async (phone, password) => {
    const res = await api.post('/auth/login', { phone, password });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('globist_token');
    localStorage.removeItem('globist_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('globist_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, verifyOtp, login, logout, updateUser, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { api };
