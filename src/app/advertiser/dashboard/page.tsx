'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import AnalyticsChart from '@/components/AnalyticsChart'
import Link from 'next/link'

interface AdCampaign {
  id: string
  title: string
  status: 'active' | 'completed' | 'paused'
  totalViews: number
  targetViews: number
  budget: number
  spent: number
  ctr: number
  duration: number
  createdAt: string
  videoUrl: string
  clickUrl?: string
}

export default function AdvertiserDashboard() {
  const { user, isAdvertiserMode } = useAuth()
  const router = useRouter()
  
  const [campaigns] = useState<AdCampaign[]>([
    {
      id: '1',
      title: 'Summer Product Launch',
      status: 'active',
      totalViews: 1247,
      targetViews: 5000,
      budget: 500,
      spent: 124.70,
      ctr: 3.2,
      duration: 30,
      createdAt: '2024-01-15',
      videoUrl: '/videos/ad1.mp4',
      clickUrl: 'https://example.com/product'
    },
    {
      id: '2',
      title: 'Brand Awareness Campaign',
      status: 'completed',
      totalViews: 10000,
      targetViews: 10000,
      budget: 1000,
      spent: 1000,
      ctr: 2.8,
      duration: 45,
      createdAt: '2024-01-01',
      videoUrl: '/videos/ad2.mp4',
      clickUrl: 'https://example.com/brand'
    },
    {
      id: '3',
      title: 'Holiday Special Offer',
      status: 'paused',
      totalViews: 567,
      targetViews: 3000,
      budget: 300,
      spent: 56.70,
      ctr: 4.1,
      duration: 20,
      createdAt: '2024-01-10',
      videoUrl: '/videos/ad3.mp4'
    }
  ])

  const [analytics] = useState({
    totalSpent: 1181.40,
    totalViews: 11814,
    avgCTR: 3.37,
    activeCampaigns: 1,
    chartData: [
      { name: 'Mon', views: 145, revenue: 14.5 },
      { name: 'Tue', views: 189, revenue: 18.9 },
      { name: 'Wed', views: 234, revenue: 23.4 },
      { name: 'Thu', views: 167, revenue: 16.7 },
      { name: 'Fri', views: 298, revenue: 29.8 },
      { name: 'Sat', views: 201, revenue: 20.1 },
      { name: 'Sun', views: 156, revenue: 15.6 }
    ]
  })

  useEffect(() => {
    if (!user || !isAdvertiserMode) {
      router.push('/')
    }
  }, [user, isAdvertiserMode, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600'
      case 'completed':
        return 'bg-blue-600'
      case 'paused':
        return 'bg-yellow-600'
      default:
        return 'bg-gray-600'
    }
  }

  const handlePauseCampaign = (campaignId: string) => {
    console.log('Pausing campaign:', campaignId)
  }

  const handleResumeCampaign = (campaignId: string) => {
    console.log('Resuming campaign:', campaignId)
  }

  const handleDeleteCampaign = (campaignId: string) => {
    console.log('Deleting campaign:', campaignId)
  }

  if (!user || !isAdvertiserMode) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Advertiser Dashboard</h1>
            <p className="text-gray-400">Manage your ad campaigns and track performance</p>
          </div>
          <Link href="/advertiser/upload">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Create New Campaign
            </Button>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${analytics.totalSpent}</p>
                <p className="text-sm text-gray-400">Total Spent</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Total Views</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{analytics.avgCTR}%</p>
                <p className="text-sm text-gray-400">Avg CTR</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{analytics.activeCampaigns}</p>
                <p className="text-sm text-gray-400">Active Campaigns</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{campaign.title}</h3>
                          <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                            {campaign.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Views</p>
                            <p className="text-white font-semibold">
                              {campaign.totalViews.toLocaleString()} / {campaign.targetViews.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Budget</p>
                            <p className="text-white font-semibold">
                              ${campaign.spent} / ${campaign.budget}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">CTR</p>
                            <p className="text-white font-semibold">{campaign.ctr}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="text-white font-semibold">{campaign.duration}s</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round((campaign.totalViews / campaign.targetViews) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(campaign.totalViews / campaign.targetViews) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePauseCampaign(campaign.id)}
                          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                        >
                          Pause
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResumeCampaign(campaign.id)}
                          className="border-green-600 text-green-400 hover:bg-green-600/20"
                        >
                          Resume
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart 
                  data={analytics.chartData} 
                  type="bar"
                  showRevenue={false}
                  showViews={true}
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Campaign Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-3">
                  <h4 className="text-purple-400 font-semibold text-sm">Optimize Your CTR</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    Include clear call-to-actions in your video ads to improve click-through rates.
                  </p>
                </div>
                
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                  <h4 className="text-blue-400 font-semibold text-sm">Bonus Revenue</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    Creators earn bonus when users stay on your site for 2+ minutes after clicking.
                  </p>
                </div>
                
                <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                  <h4 className="text-green-400 font-semibold text-sm">Video Quality</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    High-quality, engaging videos perform better and reach completion more often.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/advertiser/upload">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Create New Campaign
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Download Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Billing & Payments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
