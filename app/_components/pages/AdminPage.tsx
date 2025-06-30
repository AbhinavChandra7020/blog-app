// app/admin/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '../Button'
import PostCard from '../PostCard'
import Input from '../Input'
import RichTextEditor from '../RichTextEditor'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  // Fix: Ensure formData always has string values
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/signin')
      return
    }
  }, [session, status, router])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      } else {
        console.error('Failed to fetch posts:', data.message)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    // Fix: Add null checks before calling trim()
    if (!formData.title?.trim() || !formData.content?.trim()) return

    setSaving(true)
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ title: '', content: '' })
        setShowCreateForm(false)
        fetchPosts() // Refresh posts list
      } else {
        alert('Failed to create post: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setSaving(false)
    }
  }

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    // Fix: Add null checks before calling trim()
    if (!editingPost || !formData.title?.trim() || !formData.content?.trim()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/posts/${editingPost.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ title: '', content: '' })
        setEditingPost(null)
        fetchPosts() // Refresh posts list
      } else {
        alert('Failed to update post: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        fetchPosts() // Refresh posts list
      } else {
        alert('Failed to delete post: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const startEdit = (post: Post) => {
    setEditingPost(post)
    // Fix: Ensure we always set string values
    setFormData({ 
      title: post.title || '', 
      content: post.content || '' 
    })
    setShowCreateForm(false)
  }

  const cancelEdit = () => {
    setEditingPost(null)
    setFormData({ title: '', content: '' })
  }

  const startCreate = () => {
    setShowCreateForm(true)
    setEditingPost(null)
    setFormData({ title: '', content: '' })
  }

  const cancelCreate = () => {
    setShowCreateForm(false)
    setFormData({ title: '', content: '' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fern_green"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-mindaro mb-2">Admin Dashboard</h1>
          <p className="text-moss_green">Manage your blog posts</p>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingPost) && (
          <div className="bg-hunter_green border border-fern_green rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-mindaro mb-6">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            
            <form onSubmit={editingPost ? handleEditPost : handleCreatePost} className="space-y-6">
              <Input
                label="Title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title"
                required
              />

              <div>
                <label className="block text-sm font-medium text-moss_green mb-1">
                  Content
                </label>
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Write your post content..."
                />
              </div>

              <div className="flex gap-4">
                {/* Fix: Add null checks and fallback to empty string */}
                <Button 
                  type="submit" 
                  disabled={saving || !(formData.title?.trim()) || !(formData.content?.trim())}
                >
                  {saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={editingPost ? cancelEdit : cancelCreate}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Action Buttons */}
        {!showCreateForm && !editingPost && (
          <div className="mb-8">
            <Button onClick={startCreate} size="lg">
              + Create New Post
            </Button>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-semibold text-mindaro mb-6">
            All Posts ({posts.length})
          </h2>
          
          {posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  showActions={true}
                  onEdit={startEdit}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-hunter_green border border-fern_green rounded-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-mindaro mb-2">No posts yet</h3>
              <p className="text-moss_green mb-6">Create your first blog post to get started.</p>
              <Button onClick={startCreate}>Create Your First Post</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}