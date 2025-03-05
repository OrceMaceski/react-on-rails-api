import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, validateToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token) {
        try {
          // Validate the token with the backend
          const isValid = await validateToken(token);
          if (isValid) {
            setIsAuthenticated(true);
            setCurrentUser(user);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      const token = data?.status?.token;
      const user = data?.status?.data?.user;

      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message };
    }
  };

  const signup = async (email, password, password_confirmation) => {
    setError(null);
    try {
      const data = await signupUser(email, password, password_confirmation);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to signup');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      setCurrentUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};