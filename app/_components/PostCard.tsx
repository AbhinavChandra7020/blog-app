// app/_components/PostCard.tsx
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
}

interface PostCardProps {
  post: Post
  showActions?: boolean
  onEdit?: (post: Post) => void
  onDelete?: (slug: string) => void
}

export default function PostCard({ post, showActions = false, onEdit, onDelete }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-hunter_green border border-fern_green rounded-lg p-6 hover:border-moss_green transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href={`/posts/${post.slug}`} className="group">
            <h3 className="text-xl font-semibold text-mindaro group-hover:text-moss_green transition-colors mb-2">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-moss_green">
            <span>Created: {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span>Updated: {formatDate(post.updatedAt)}</span>
            )}
          </div>
          
          <Link 
            href={`/posts/${post.slug}`}
            className="text-fern_green hover:text-moss_green text-sm mt-2 inline-block transition-colors"
          >
            Read more →
          </Link>
        </div>
        
        {showActions && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit?.(post)}
              className="px-3 py-1 text-sm bg-fern_green text-dark_green rounded hover:bg-fern_green/90 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(post.slug)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}