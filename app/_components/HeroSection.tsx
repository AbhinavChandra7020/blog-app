// app/_components/HeroSection.tsx
import SearchBar from './SearchBar'

interface HeroSectionProps {
  onSearch: (query: string) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-dark_green to-hunter_green py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-mindaro mb-6">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-moss_green mb-8 max-w-3xl mx-auto">
          Discover insightful articles, tutorials, and stories. Search through our collection
          {/* eslint-disable-next-line react/no-unescaped-entities */} 
          of posts to find exactly what you're looking for.
        </p>
        
        <div className="mb-8">
          <SearchBar onSearch={onSearch} placeholder="Search posts by title or content..." />
        </div>
        
        <div className="flex justify-center items-center gap-8 text-moss_green">
          <div className="text-center">
            <div className="text-2xl font-bold text-mindaro">Rich Content</div>
            <div className="text-sm">Beautifully formatted posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-mindaro">SEO Optimized</div>
            <div className="text-sm">Search engine friendly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-mindaro">Fast Search</div>
            <div className="text-sm">Find content instantly</div>
          </div>
        </div>
      </div>
    </section>
  )
}