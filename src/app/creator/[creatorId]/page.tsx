'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import VideoPlayer from '@/components/VideoPlayer'

interface Creator {
  id: string
  username: string
  displayName: string
  bio: string
  logoUrl?: string
  bannerUrl?: string
  socialLinks: {
    twitter?: string
    instagram?: string
    youtube?: string
    twitch?: string
    website?: string
  }
  stats: {
    totalSupport: number
    supporterCount: number
    recentSupporters: string[]
  }
}

interface AdVideo {
  id: string
  title: string
  videoUrl: string
  duration: number
  clickUrl?: string
  advertiserName: string
}

export default function CreatorPage() {
  const params = useParams()
  const creatorId = params.creatorId as string
  
  const [creator, setCreator] = useState<Creator | null>(null)
  const [currentAd, setCurrentAd] = useState<AdVideo | null>(null)
  const [isAdModalOpen, setIsAdModalOpen] = useState(false)
  const [dailyAdCount, setDailyAdCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWatchedAd, setHasWatchedAd] = useState(false)

  const MAX_DAILY_ADS = 5

  useEffect(() => {
    // Simulate fetching creator data
    const fetchCreatorData = async () => {
      try {
        // Mock creator data
        const mockCreator: Creator = {
          id: creatorId,
          username: 'creator_user',
          displayName: 'Amazing Creator',
          bio: 'Welcome to my creator space! I create amazing content and your support means the world to me. Watch ads to help me continue creating!',
          logoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          bannerUrl: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&dpr=1',
          socialLinks: {
            twitter: 'https://twitter.com/creator',
            youtube: 'https://youtube.com/creator',
            website: 'https://creator-website.com'
          },
          stats: {
            totalSupport: 1247.50,
            supporterCount: 89,
            recentSupporters: ['User123', 'Supporter456', 'Fan789']
          }
        }
        
        setCreator(mockCreator)
        
        // Get daily ad count from localStorage
        const today = new Date().toDateString()
        const storedData = localStorage.getItem(`adCount_${today}`)
        if (storedData) {
          setDailyAdCount(parseInt(storedData))
        }
        
      } catch (error) {
        console.error('Failed to fetch creator data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreatorData()
  }, [creatorId])

  const fetchRandomAd = async (): Promise<AdVideo> => {
    // Mock ad data
    const mockAds: AdVideo[] = [
      {
        id: '1',
        title: 'Summer Product Launch',
        videoUrl: '/videos/sample-ad-1.mp4',
        duration: 30,
        clickUrl: 'https://example.com/product',
        advertiserName: 'TechCorp'
      },
      {
        id: '2',
        title: 'Brand Awareness Campaign',
        videoUrl: '/videos/sample-ad-2.mp4',
        duration: 45,
        clickUrl: 'https://example.com/brand',
        advertiserName: 'BrandCo'
      },
      {
        id: '3',
        title: 'Holiday Special Offer',
        videoUrl: '/videos/sample-ad-3.mp4',
        duration: 20,
        advertiserName: 'ShopNow'
      }
    ]
    
    return mockAds[Math.floor(Math.random() * mockAds.length)]
  }

  const handleWatchAd = async () => {
    if (dailyAdCount >= MAX_DAILY_ADS) {
      alert('You have reached the daily limit of 5 ads. Come back tomorrow!')
      return
    }

    try {
      const ad = await fetchRandomAd()
      setCurrentAd(ad)
      setIsAdModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch ad:', error)
      alert('Failed to load ad. Please try again.')
    }
  }

  const handleAdComplete = async () => {
    if (!currentAd || !creator) return

    try {
      // Update daily ad count
      const newCount = dailyAdCount + 1
      setDailyAdCount(newCount)
      
      const today = new Date().toDateString()
      localStorage.setItem(`adCount_${today}`, newCount.toString())
      
      // Simulate API call to record ad view
      console.log('Recording ad view:', {
        adId: currentAd.id,
        creatorId: creator.id,
        timestamp: new Date().toISOString()
      })
      
      setHasWatchedAd(true)
      setIsAdModalOpen(false)
      
      // Show success message
      alert(`Thank you for supporting ${creator.displayName}! Your view has been recorded.`)
      
    } catch (error) {
      console.error('Failed to record ad view:', error)
    }
  }

  const handleAdClick = () => {
    if (currentAd?.clickUrl) {
      // Record click event
      console.log('Ad clicked:', currentAd.id)
      
      // Open advertiser's site
      window.open(currentAd.clickUrl, '_blank')
      
      // Start tracking time spent on advertiser site for bonus
      const startTime = Date.now()
      localStorage.setItem(`adClick_${currentAd.id}`, startTime.toString())
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading creator page...</div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Creator Not Found</h1>
          <p className="text-gray-400">The creator you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        {creator.bannerUrl ? (
          <img
            src={creator.bannerUrl}
            alt="Creator Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Profile */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {creator.logoUrl ? (
                    <img
                      src={creator.logoUrl}
                      alt={creator.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 -mt-12"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-4 border-purple-500 -mt-12">
                      <span className="text-white font-bold text-2xl">
                        {creator.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{creator.displayName}</h1>
                    <p className="text-gray-400 mb-1">@{creator.username}</p>
                    <div className="flex gap-4 text-sm text-gray-300 mb-4">
                      <span>{creator.stats.supporterCount} supporters</span>
                      <span>${creator.stats.totalSupport.toFixed(2)} total support</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{creator.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {Object.values(creator.socialLinks).some(link => link) && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Connect with {creator.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(creator.socialLinks)
                      .filter(([_, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Supporters */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {creator.stats.recentSupporters.map((supporter, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {supporter.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white">{supporter}</span>
                      <Badge variant="secondary" className="ml-auto">
                        Supporter
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Panel */}
          <div className="space-y-6">
            {/* Support Action */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Support {creator.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-4">
                    Watch ads to directly support this creator. Every view counts!
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-purple-400">
                      {dailyAdCount} / {MAX_DAILY_ADS}
                    </div>
                    <div className="text-gray-400 text-sm">ads watched today</div>
                  </div>
                  
                  <Button
                    onClick={handleWatchAd}
                    disabled={dailyAdCount >= MAX_DAILY_ADS}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {dailyAdCount >= MAX_DAILY_ADS ? 'Daily Limit Reached' : 'Watch Ad to Support'}
                  </Button>
                  
                  {dailyAdCount >= MAX_DAILY_ADS && (
                    <p className="text-yellow-400 text-xs mt-2">
                      Come back tomorrow to support more!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p className="text-gray-300">Click "Watch Ad to Support" to view a targeted advertisement</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <p className="text-gray-300">Watch the full ad to generate revenue for the creator</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <p className="text-gray-300">Optionally click through to the advertiser's site for bonus support</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">4</div>
                  <p className="text-gray-300">Stay on the advertiser's site for 2+ minutes for extra creator bonus</p>
                </div>
              </CardContent>
            </Card>

            {/* Support Stats */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ads watched today:</span>
                  <span className="text-white font-semibold">{dailyAdCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated support:</span>
                  <span className="text-green-400 font-semibold">${(dailyAdCount * 0.15).toFixed(2)}</span>
                </div>
                {hasWatchedAd && (
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 mt-4">
                    <p className="text-green-400 text-sm font-semibold">Thank you for your support!</p>
                    <p className="text-gray-300 text-xs">Your ad view has been recorded and the creator will receive their share.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ad Modal */}
      <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentAd ? `Supporting ${creator.displayName}` : 'Loading Ad...'}
            </DialogTitle>
          </DialogHeader>
          {currentAd && (
            <div className="space-y-4">
              <VideoPlayer
                src={currentAd.videoUrl}
                onComplete={handleAdComplete}
                onError={() => {
                  alert('Failed to load video. Please try again.')
                  setIsAdModalOpen(false)
                }}
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{currentAd.title}</p>
                  <p className="text-gray-400 text-sm">by {currentAd.advertiserName}</p>
                </div>
                {currentAd.clickUrl && (
                  <Button
                    onClick={handleAdClick}
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                  >
                    Visit Advertiser
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
