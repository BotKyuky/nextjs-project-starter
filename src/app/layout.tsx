import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/Header'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unyris - AI-Driven Creator Platform',
  description: 'Connect creators, advertisers, and supporters in a futuristic ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <SessionProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
              <Header />
              <main className="relative">
                {children}
              </main>
            </div>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
