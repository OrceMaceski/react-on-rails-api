import api from './api'

export const getPosts = async () => {
  try {
    const response = await api.get('/posts')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch posts')
  }
}

export const getPost = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch post')
  }
}

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create post')
  }
}

export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}`, { post: postData })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update post')
  }
}

export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`)
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete post')
  }
}