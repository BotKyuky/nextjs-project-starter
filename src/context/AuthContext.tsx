'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
  id: string
  username: string
  avatar?: string
  discriminator?: string
  email?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isCreatorMode: boolean
  isAdvertiserMode: boolean
  toggleCreatorMode: () => void
  toggleAdvertiserMode: () => void
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isCreatorMode, setIsCreatorMode] = React.useState(false)
  const [isAdvertiserMode, setIsAdvertiserMode] = React.useState(false)

  const user = session?.user ? {
    id: session.user.id,
    username: session.user.username || session.user.name || 'Unknown',
    avatar: session.user.avatar || session.user.image || undefined,
    discriminator: session.user.discriminator,
    email: session.user.email || undefined,
  } : null

  const isLoading = status === 'loading'

  const login = () => {
    signIn('discord')
  }

  const logout = () => {
    signOut()
    setIsCreatorMode(false)
    setIsAdvertiserMode(false)
  }

  const toggleCreatorMode = () => {
    setIsCreatorMode(!isCreatorMode)
  }

  const toggleAdvertiserMode = () => {
    setIsAdvertiserMode(!isAdvertiserMode)
  }

  const value = {
    user,
    isLoading,
    isCreatorMode,
    isAdvertiserMode,
    toggleCreatorMode,
    toggleAdvertiserMode,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
