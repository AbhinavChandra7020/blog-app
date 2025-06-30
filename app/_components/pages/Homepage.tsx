// app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import HeroSection from '../HeroSection'
import PostCard from '../PostCard'

interface Post {
  _id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPosts = async (search = '') => {
    try {
      setLoading(true)
      const url = search 
        ? `/api/posts?search=${encodeURIComponent(search)}`
        : '/api/posts'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      } else {
        console.error('Failed to fetch posts:', data.message)
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchPosts(query)
  }

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            {searchQuery ? (
              <h2 className="text-3xl font-bold text-mindaro">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Search Results for "{searchQuery}"
              </h2>
            ) : (
              <h2 className="text-3xl font-bold text-mindaro">
                Latest Posts
              </h2>
            )}
            <p className="text-moss_green mt-2">
              {loading ? 'Loading...' : `${posts.length} post${posts.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fern_green"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-mindaro mb-2">
                {searchQuery ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-moss_green">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all posts.'
                  : 'Check back later for new content.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-4 text-fern_green hover:text-moss_green transition-colors"
                >
                  View all posts →
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}