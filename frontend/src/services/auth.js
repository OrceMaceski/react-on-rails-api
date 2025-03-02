import api from './api'

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { user: { email, password } })
    // console.log('Login JWT response:', response.data.status.token)  // Check what's returned
    return response.data
  } catch (error) {
    console.error('Login error:', error.response?.data)
    throw new Error(error.response?.data?.error || 'Login failed')
  }
}

export const signupUser = async (email, password, password_confirmation) => {
  try {
    const response = await api.post('/signup', {
      user: { email, password, password_confirmation }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup failed')
  }
}

export const logoutUser = async () => {
  try {
    await api.delete('/logout')
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed')
  }
}