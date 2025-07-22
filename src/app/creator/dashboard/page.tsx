'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AnalyticsChart from '@/components/AnalyticsChart'

export default function CreatorDashboard() {
  const { user, isCreatorMode } = useAuth()
  const router = useRouter()
  const [creatorData, setCreatorData] = useState({
    logo: '',
    title: '',
    description: '',
    externalLinks: [''],
    introVideo: ''
  })

  const [analytics] = useState({
    totalViews: 1247,
    totalRevenue: 89.32,
    todayViews: 23,
    todayRevenue: 4.67,
    conversionRate: 12.5,
    avgWatchTime: 45,
    chartData: [
      { name: 'Mon', views: 45, revenue: 8.2 },
      { name: 'Tue', views: 52, revenue: 9.8 },
      { name: 'Wed', views: 38, revenue: 6.4 },
      { name: 'Thu', views: 61, revenue: 11.2 },
      { name: 'Fri', views: 49, revenue: 8.9 },
      { name: 'Sat', views: 67, revenue: 12.1 },
      { name: 'Sun', views: 43, revenue: 7.8 }
    ]
  })

  useEffect(() => {
    if (!user || !isCreatorMode) {
      router.push('/')
    }
  }, [user, isCreatorMode, router])

  const handleInputChange = (field: string, value: string) => {
    setCreatorData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...creatorData.externalLinks]
    newLinks[index] = value
    setCreatorData(prev => ({
      ...prev,
      externalLinks: newLinks
    }))
  }

  const addLink = () => {
    setCreatorData(prev => ({
      ...prev,
      externalLinks: [...prev.externalLinks, '']
    }))
  }

  const removeLink = (index: number) => {
    const newLinks = creatorData.externalLinks.filter((_, i) => i !== index)
    setCreatorData(prev => ({
      ...prev,
      externalLinks: newLinks
    }))
  }

  if (!user || !isCreatorMode) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-gray-400">Manage your creator space and track your performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel - Page Editor */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Page Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger value="basic" className="text-white">Basic Info</TabsTrigger>
                    <TabsTrigger value="media" className="text-white">Media</TabsTrigger>
                    <TabsTrigger value="links" className="text-white">Links</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Page Title</Label>
                      <Input
                        id="title"
                        value={creatorData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Your creator page title"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={creatorData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Tell your supporters about yourself"
                        className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <Label htmlFor="logo" className="text-white">Logo URL</Label>
                      <Input
                        id="logo"
                        value={creatorData.logo}
                        onChange={(e) => handleInputChange('logo', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="intro-video" className="text-white">Introduction Video URL</Label>
                      <Input
                        id="intro-video"
                        value={creatorData.introVideo}
                        onChange={(e) => handleInputChange('introVideo', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="links" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-white">External Links</Label>
                      {creatorData.externalLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                          {creatorData.externalLinks.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeLink(index)}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={addLink}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Add Link
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  {creatorData.logo && (
                    <img
                      src={creatorData.logo}
                      alt="Logo"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {creatorData.title || 'Your Page Title'}
                  </h3>
                  <p className="text-gray-300">
                    {creatorData.description || 'Your description will appear here'}
                  </p>
                  {creatorData.externalLinks.filter(link => link).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">Links:</h4>
                      {creatorData.externalLinks
                        .filter(link => link)
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-purple-400 hover:text-purple-300 underline"
                          >
                            {link}
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Analytics & Monetization */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{analytics.totalViews}</p>
                    <p className="text-sm text-gray-400">Total Views</p>
                    <p className="text-xs text-green-400">+{analytics.todayViews} today</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">${analytics.totalRevenue}</p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <p className="text-xs text-green-400">+${analytics.todayRevenue} today</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{analytics.conversionRate}%</p>
                    <p className="text-sm text-gray-400">Conversion Rate</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{analytics.avgWatchTime}s</p>
                    <p className="text-sm text-gray-400">Avg Watch Time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={analytics.chartData} />
              </CardContent>
            </Card>

            {/* Monetization Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Monetization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">Ad Revenue Sharing</h4>
                    <p className="text-gray-400 text-sm">Earn from supporter ad views</p>
                  </div>
                  <div className="text-green-400 font-bold">Active</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">Bonus Triggers</h4>
                    <p className="text-gray-400 text-sm">Extra revenue from 2+ min stays</p>
                  </div>
                  <div className="text-green-400 font-bold">Active</div>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
