'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

export default function AdvertiserUpload() {
  const { user, isAdvertiserMode } = useAuth()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null as File | null,
    duration: 30,
    targetViews: 1000,
    clickUrl: '',
    budget: 0
  })

  const [pricing] = useState({
    baseCostPerView: 0.10,
    durationMultiplier: {
      15: 0.8,
      30: 1.0,
      45: 1.2,
      60: 1.5
    }
  })

  useEffect(() => {
    if (!user || !isAdvertiserMode) {
      router.push('/')
    }
  }, [user, isAdvertiserMode, router])

  useEffect(() => {
    // Calculate budget based on duration and target views
    const multiplier = pricing.durationMultiplier[formData.duration as keyof typeof pricing.durationMultiplier] || 1.0
    const calculatedBudget = formData.targetViews * pricing.baseCostPerView * multiplier
    setFormData(prev => ({ ...prev, budget: calculatedBudget }))
  }, [formData.duration, formData.targetViews, pricing])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file')
        return
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB')
        return
      }
      
      setFormData(prev => ({ ...prev, videoFile: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.videoFile) {
      alert('Please select a video file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 500)

      // Simulate API call for video upload and compression
      const uploadFormData = new FormData()
      uploadFormData.append('video', formData.videoFile)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('duration', formData.duration.toString())
      uploadFormData.append('targetViews', formData.targetViews.toString())
      uploadFormData.append('clickUrl', formData.clickUrl)
      uploadFormData.append('budget', formData.budget.toString())

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setUploadProgress(100)
      
      // Simulate successful upload
      setTimeout(() => {
        alert('Campaign created successfully!')
        router.push('/advertiser/dashboard')
      }, 1000)

    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user || !isAdvertiserMode) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Ad Campaign</h1>
          <p className="text-gray-400">Upload your video ad and configure your campaign settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Campaign Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter campaign title"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your campaign"
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Video Upload */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Video Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="video-file" className="text-white">Video File</Label>
                    <div className="mt-2">
                      <input
                        id="video-file"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                        required
                      />
                    </div>
                    {formData.videoFile && (
                      <p className="text-green-400 text-sm mt-2">
                        Selected: {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="duration" className="text-white">Video Duration (seconds)</Label>
                    <Select value={formData.duration.toString()} onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="15" className="text-white">15 seconds</SelectItem>
                        <SelectItem value="30" className="text-white">30 seconds</SelectItem>
                        <SelectItem value="45" className="text-white">45 seconds</SelectItem>
                        <SelectItem value="60" className="text-white">60 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Configuration */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="target-views" className="text-white">Target Views</Label>
                    <Input
                      id="target-views"
                      type="number"
                      value={formData.targetViews}
                      onChange={(e) => handleInputChange('targetViews', parseInt(e.target.value) || 0)}
                      placeholder="1000"
                      min="100"
                      max="100000"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="click-url" className="text-white">Click-through URL (Optional)</Label>
                    <Input
                      id="click-url"
                      type="url"
                      value={formData.clickUrl}
                      onChange={(e) => handleInputChange('clickUrl', e.target.value)}
                      placeholder="https://your-website.com"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Upload Progress */}
              {isUploading && (
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Uploading and processing video...</span>
                        <span className="text-white">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-gray-400 text-xs">
                        Video compression and optimization in progress. This may take a few minutes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isUploading || !formData.videoFile}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isUploading ? 'Creating Campaign...' : 'Create Campaign'}
              </Button>
            </form>
          </div>

          {/* Pricing & Preview */}
          <div className="space-y-6">
            {/* Pricing Calculator */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Campaign Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base cost per view:</span>
                    <span className="text-white">${pricing.baseCostPerView}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration multiplier:</span>
                    <span className="text-white">
                      {pricing.durationMultiplier[formData.duration as keyof typeof pricing.durationMultiplier]}x
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target views:</span>
                    <span className="text-white">{formData.targetViews.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total Budget:</span>
                      <span className="text-green-400 font-bold text-lg">
                        ${formData.budget.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Tips */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-3">
                  <h4 className="text-purple-400 font-semibold text-sm">Video Quality</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    High-quality videos with clear audio perform better and have higher completion rates.
                  </p>
                </div>
                
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                  <h4 className="text-blue-400 font-semibold text-sm">Call to Action</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    Include a clear call-to-action in your video to improve click-through rates.
                  </p>
                </div>
                
                <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                  <h4 className="text-green-400 font-semibold text-sm">Bonus Revenue</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    Creators earn bonus when users stay on your site for 2+ minutes after clicking.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File Requirements */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">File Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max file size:</span>
                  <span className="text-white">100 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supported formats:</span>
                  <span className="text-white">MP4, MOV, AVI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recommended resolution:</span>
                  <span className="text-white">1920x1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aspect ratio:</span>
                  <span className="text-white">16:9</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
