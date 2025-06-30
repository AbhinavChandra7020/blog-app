'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Post {
  title: string
  content: string
  slug: string
  createdAt: string
  updatedAt: string
  metaTitle?: string
  metaDescription?: string
}

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts/${slug}`)
        const data = await response.json()

        if (data.success) {
          setPost(data.data)
          
          // Update meta tags for SEO
          if (data.data.metaTitle) {
            document.title = data.data.metaTitle
          }
          
          if (data.data.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]')
            if (!metaDesc) {
              metaDesc = document.createElement('meta')
              metaDesc.setAttribute('name', 'description')
              document.head.appendChild(metaDesc)
            }
            metaDesc.setAttribute('content', data.data.metaDescription)
          }
        } else {
          setError(data.message || 'Post not found')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fern_green"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-mindaro mb-2">Post Not Found</h1>
          <p className="text-moss_green mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <Link 
            href="/" 
            className="text-fern_green hover:text-moss_green transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-fern_green hover:text-moss_green transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Posts
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-mindaro mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-moss_green text-sm">
            <span>Published: {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span>Updated: {formatDate(post.updatedAt)}</span>
            )}
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="text-mindaro leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              // Override prose styles for our color scheme
              color: 'var(--color-mindaro)',
            }}
          />
        </article>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-fern_green">
          <div className="flex justify-between items-center">
            <Link 
              href="/"
              className="text-fern_green hover:text-moss_green transition-colors"
            >
              ← Back to all posts
            </Link>
            
            <div className="text-moss_green text-sm">
              Slug: {post.slug}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}