'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

export default function CreatorCustomize() {
  const { user, isCreatorMode } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    logoUrl: '',
    bannerUrl: '',
    introVideoUrl: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      twitch: '',
      website: ''
    },
    settings: {
      allowDirectSupport: true,
      showRecentSupporters: true,
      enableNotifications: true
    }
  })

  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (!user || !isCreatorMode) {
      router.push('/')
    }
  }, [user, isCreatorMode, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }))
  }

  const handleSave = () => {
    // Save logic will be implemented here
    console.log('Saving creator data:', formData)
  }

  if (!user || !isCreatorMode) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Customize Your Page</h1>
            <p className="text-gray-400">Design your creator space to attract supporters</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="preview-mode"
                checked={previewMode}
                onCheckedChange={setPreviewMode}
              />
              <Label htmlFor="preview-mode" className="text-white">
                Preview Mode
              </Label>
            </div>
            <Button 
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="display-name" className="text-white">Display Name</Label>
                  <Input
                    id="display-name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Your creator name"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell your supporters about yourself..."
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Assets */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-url" className="text-white">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="banner-url" className="text-white">Banner URL</Label>
                  <Input
                    id="banner-url"
                    value={formData.bannerUrl}
                    onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="intro-video" className="text-white">Introduction Video URL</Label>
                  <Input
                    id="intro-video"
                    value={formData.introVideoUrl}
                    onChange={(e) => handleInputChange('introVideoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <Label htmlFor={platform} className="text-white capitalize">
                      {platform}
                    </Label>
                    <Input
                      id={platform}
                      value={url}
                      onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                      placeholder={`Your ${platform} URL`}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData.settings).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <Label htmlFor={setting} className="text-white">
                      {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={setting}
                      checked={enabled}
                      onCheckedChange={(value) => handleSettingChange(setting, value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  {/* Banner */}
                  {formData.bannerUrl ? (
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${formData.bannerUrl})` }}></div>
                  ) : (
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    {/* Profile Section */}
                    <div className="flex items-start gap-4">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {(formData.displayName || user.username).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">
                          {formData.displayName || user.username}
                        </h2>
                        <p className="text-gray-300 text-sm mt-1">
                          {formData.bio || 'Your bio will appear here'}
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    {Object.values(formData.socialLinks).some(link => link) && (
                      <div className="space-y-2">
                        <h3 className="text-white font-semibold">Connect with me:</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(formData.socialLinks)
                            .filter(([_, url]) => url)
                            .map(([platform, url]) => (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors"
                              >
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </a>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Support Section */}
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                      <h3 className="text-white font-semibold">Support My Work</h3>
                      <p className="text-gray-300 text-sm">
                        Watch ads to support me directly. Every view helps!
                      </p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Watch Ad to Support
                      </Button>
                    </div>

                    {/* Introduction Video */}
                    {formData.introVideoUrl && (
                      <div className="space-y-2">
                        <h3 className="text-white font-semibold">Introduction</h3>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <p className="text-gray-300 text-sm">Video: {formData.introVideoUrl}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Link */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Share Your Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label className="text-white">Your Creator Page URL:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`https://unyris.com/creator/${user.id}`}
                      readOnly
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(`https://unyris.com/creator/${user.id}`)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
