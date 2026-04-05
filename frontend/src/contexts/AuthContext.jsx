import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
           const response = await api.get('/api/auth/me');
           setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      return true;
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);