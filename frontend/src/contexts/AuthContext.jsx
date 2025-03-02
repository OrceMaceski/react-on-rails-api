import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, validateToken } from '../services/auth'; // Import validateToken

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Validate the token with the backend
          const isValid = await validateToken(token);
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            // If the token is invalid, clear it
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false); // Set loading to false once the check is complete
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      const token = data?.status?.token;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
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
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
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
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    isAuthenticated,
    loading, // Include loading in the context value
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};