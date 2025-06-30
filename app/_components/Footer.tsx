// app/_components/Footer.tsx
'use client'
export default function Footer() {
  return (
    <footer className="bg-hunter_green border-t border-fern_green mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-moss_green text-sm">
            © {new Date().getFullYear()} BlogPlatform. Built with Next.js and MongoDB.
          </p>
        </div>
      </div>
    </footer>
  )
}