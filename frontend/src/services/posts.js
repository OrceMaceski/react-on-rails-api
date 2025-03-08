import api from './api'

export const getPosts = async (page = 1) => {
  try {
    const response = await api.get(`/posts?page=${page}`)
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
  // If postData is a FormData object, use content type for file upload
  if (postData instanceof FormData) {
    return await api.put(`/posts/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // Regular JSON update if not a file upload
  return await api.put(`/posts/${id}`, postData)
}

export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`)
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete post')
  }
}