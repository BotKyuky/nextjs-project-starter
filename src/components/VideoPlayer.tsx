'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface VideoPlayerProps {
  src: string
  onComplete?: () => void
  onError?: () => void
  autoPlay?: boolean
}

export default function VideoPlayer({ src, onComplete, onError, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      if (!hasStarted) {
        setHasStarted(true)
      }
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (!hasCompleted) {
        setHasCompleted(true)
        onComplete?.()
      }
    }

    const handleError = () => {
      console.error('Video playback error')
      onError?.()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [onComplete, onError, hasCompleted])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    
    if (newVolume === 0) {
      setIsMuted(true)
      video.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      video.muted = false
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
            </Button>
          </div>
        )}
        
        {/* Initial Play Button */}
        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-20 h-20 rounded-full bg-purple-600 hover:bg-purple-700"
            >
              <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[12px] border-y-transparent ml-1"></div>
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-900 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              {isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white"></div>
                  <div className="w-1 h-4 bg-white"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                {isMuted || volume === 0 ? (
                  <div className="w-4 h-4 bg-white relative">
                    <div className="absolute inset-0 bg-gray-900"></div>
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white"></div>
                    <div className="absolute top-0 right-0 w-1 h-1 bg-red-500 rotate-45"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 bg-white relative">
                    <div className="absolute inset-0 bg-gray-900"></div>
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white"></div>
                  </div>
                )}
              </Button>
              
              <div className="w-20">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={(e) => handleVolumeChange([parseInt(e.target.value)])}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            {hasCompleted ? 'Completed' : hasStarted ? 'Playing' : 'Ready to play'}
          </div>
        </div>

        {/* Ad Completion Notice */}
        {hasCompleted && (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
            <p className="text-green-400 text-sm font-semibold">Ad completed successfully!</p>
            <p className="text-gray-300 text-xs">Thank you for supporting this creator.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
