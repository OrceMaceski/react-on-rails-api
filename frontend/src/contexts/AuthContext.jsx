import { createContext, useState, useContext, useEffect } from 'react'
import { loginUser, signupUser, logoutUser } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('token');

        setIsAuthenticated(false);

      }
    } else {
      // If token is missing, ensure the state is reset
      setIsAuthenticated(false);
      // Optionally, clear localStorage if needed
      localStorage.removeItem('token');
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null)
    try {
      const data = await loginUser(email, password)

      const token = data?.status?.token  // Adjust if needed
      // console.log('Login TOKEN or USER:', data.status)  // Check the token
      localStorage.setItem('token', token)

      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to login')
      return { success: false, error: err.message }
    }
  }

  const signup = async (email, password, password_confirmation) => {
    setError(null)
    try {
      const data = await signupUser(email, password, password_confirmation)
      localStorage.setItem('token', data.token)

      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to signup')
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const value = {
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}