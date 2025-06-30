'use client'
import { SessionProvider } from 'next-auth/react'
import Header from './_components/Header'
import Footer from './_components/Footer'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  )
}