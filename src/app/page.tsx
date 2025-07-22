'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const { user, login } = useAuth()
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // User roles state
  const [isAdvertiser, setIsAdvertiser] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setLastMousePosition(mousePosition)
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mousePosition])

  const calculateTransform = () => {
    if (!isClient) return 'translate(0px, 0px) scale(1)'
    
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (mousePosition.x - centerX) / 20
    const deltaY = (mousePosition.y - centerY) / 20
    
    return `translate(${deltaX}px, ${deltaY}px) scale(${isHovered ? 1.1 : 1})`
  }

  // Static particles for SSR
  const particles = isClient 
    ? Array.from({ length: 20 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3000}ms`,
        duration: `${2000 + Math.random() * 2000}ms`
      }))
    : Array.from({ length: 20 }, (_, i) => ({
        left: `${(i * 5) % 100}%`,
        top: `${(i * 7) % 100}%`,
        delay: `${i * 150}ms`,
        duration: `${2500}ms`
      }))

  // Calculate particle animation duration based on mouse speed
  const getParticleDuration = (baseDuration: number) => {
    const speed = Math.abs(mousePosition.x - lastMousePosition.x) + Math.abs(mousePosition.y - lastMousePosition.y)
    // Clamp speed to a reasonable range
    const clampedSpeed = Math.min(Math.max(speed, 0), 100)
    // Adjust duration inversely proportional to speed (faster mouse = shorter duration = faster animation)
    const adjustedDuration = baseDuration - clampedSpeed * 10
    return Math.max(adjustedDuration, 500) // minimum duration 500ms
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Animated Background Waves */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        
        {/* Floating Wave Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* User Menu Top Right */}
      {user && (
        <div className="absolute top-4 right-4 z-20">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-white">
                {user.username}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-gray-900 text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Advertiser</span>
                  <Switch checked={isAdvertiser} onCheckedChange={setIsAdvertiser} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Creator</span>
                  <Switch checked={isCreator} onCheckedChange={setIsCreator} />
                </div>
                <div className="flex flex-col space-y-2 pt-2">
                  {isAdvertiser && (
                    <Link href="/advertiser/dashboard">
                      <a className="px-3 py-2 rounded bg-purple-700 hover:bg-purple-600 text-center">
                        Advertiser Dashboard
                      </a>
                    </Link>
                  )}
                  {isCreator && (
                    <Link href="/creator/dashboard">
                      <a className="px-3 py-2 rounded bg-blue-700 hover:bg-blue-600 text-center">
                        Creator Dashboard
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
        <div className="text-center">
          {/* AI Entity */}
          <div 
            className="relative mx-auto mb-8 cursor-pointer transition-all duration-300 ease-out"
            style={{ transform: calculateTransform() }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main Circular Body */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Core Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 animate-pulse">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black border border-purple-500/30"></div>
              </div>
              
              {/* Dragon Scale Texture Overlay */}
              <div className="absolute inset-0 rounded-full opacity-60">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-purple-400/20 to-blue-400/20"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-transparent via-cyan-400/10 to-purple-400/10"></div>
              </div>
              
              {/* Spines/Protrusions */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180)
                const x = Math.cos(angle) * 120
                const y = Math.sin(angle) * 120
                
                return (
                  <div
                    key={i}
                    className="absolute w-3 h-12 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full animate-pulse"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${i * 30}deg)`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                )
              })}
              
              {/* Inner Glow Effect */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-400/30 animate-pulse delay-500"></div>
              
              {/* Central Eye/Core */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-white to-cyan-200 animate-pulse shadow-lg shadow-cyan-400/50"></div>
            </div>
          </div>

          {/* Minimal Text */}
          {!user && (
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white animate-pulse">
                Enter Unyris
              </h1>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Where creators, advertisers, and supporters converge in the future of content monetization
              </p>
              <button
                onClick={login}
                className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-colors duration-200 flex items-center gap-3 mx-auto"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Login with Discord
              </button>
            </div>
          )}

          {user && (
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Welcome back, {user.username}
                {user.discriminator && `#${user.discriminator}`}
              </h1>
              <p className="text-gray-400 text-lg">
                The entity recognizes your presence
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: `${getParticleDuration(parseInt(particle.duration))}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
