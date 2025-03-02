import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../../services/posts'
import PostItem from './PostItem'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(data)
    } catch (err) {
      setError('Failed to fetch posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading posts...</div>

  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          to="/posts/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No posts found. Create your first post!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              onPostDeleted={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Posts