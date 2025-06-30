// app/_components/Header.tsx
'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Button from './Button'
import ThemeToggler from './ThemeToggler'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-hunter_green border-b border-fern_green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-mindaro hover:text-moss_green transition-colors">
              BlogPlatform
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <ThemeToggler />
            
            {session?.user ? (
              <>
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}