// Video compression utility for the Unyris platform
// This is a simulated implementation - in production, you would use FFmpeg or cloud services

export interface CompressionOptions {
  quality: 'low' | 'medium' | 'high'
  maxSize: number // in MB
  targetDuration?: number // in seconds
  format: 'mp4' | 'webm'
}

export interface CompressionResult {
  success: boolean
  originalSize: number
  compressedSize: number
  compressionRatio: number
  outputUrl: string
  thumbnailUrl: string
  duration: number
  error?: string
}

export class VideoCompressor {
  private static instance: VideoCompressor
  
  public static getInstance(): VideoCompressor {
    if (!VideoCompressor.instance) {
      VideoCompressor.instance = new VideoCompressor()
    }
    return VideoCompressor.instance
  }

  /**
   * Compress a video file with specified options
   * In a real implementation, this would use FFmpeg or cloud services like AWS MediaConvert
   */
  async compressVideo(
    file: File, 
    options: CompressionOptions,
    onProgress?: (progress: number) => void
  ): Promise<CompressionResult> {
    try {
      // Validate input file
      if (!file.type.startsWith('video/')) {
        throw new Error('Invalid file type. Expected video file.')
      }

      const originalSize = file.size / (1024 * 1024) // Convert to MB

      // Simulate compression process with progress updates
      if (onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          onProgress(i)
        }
      }

      // Simulate compression calculations
      const compressionRatio = this.calculateCompressionRatio(options.quality)
      const compressedSize = originalSize * compressionRatio
      
      // Generate mock URLs (in production, these would be actual cloud storage URLs)
      const timestamp = Date.now()
      const outputUrl = `/videos/compressed/${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.${options.format}`
      const thumbnailUrl = `/thumbnails/${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.jpg`

      // Simulate getting video duration
      const duration = await this.getVideoDuration(file)

      const result: CompressionResult = {
        success: true,
        originalSize,
        compressedSize,
        compressionRatio,
        outputUrl,
        thumbnailUrl,
        duration
      }

      console.log('Video compression completed:', result)
      return result

    } catch (error) {
      console.error('Video compression failed:', error)
      return {
        success: false,
        originalSize: file.size / (1024 * 1024),
        compressedSize: 0,
        compressionRatio: 0,
        outputUrl: '',
        thumbnailUrl: '',
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown compression error'
      }
    }
  }

  /**
   * Generate video thumbnail
   */
  async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.onloadedmetadata = () => {
        // Set canvas dimensions
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Seek to middle of video for thumbnail
        video.currentTime = video.duration / 2
      }

      video.onseeked = () => {
        if (ctx) {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convert to data URL
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnailDataUrl)
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }

      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail generation'))
      }

      // Load video file
      const url = URL.createObjectURL(file)
      video.src = url
      video.load()
    })
  }

  /**
   * Get video duration
   */
  private async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      
      video.onloadedmetadata = () => {
        resolve(video.duration)
        URL.revokeObjectURL(video.src)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'))
        URL.revokeObjectURL(video.src)
      }

      const url = URL.createObjectURL(file)
      video.src = url
      video.load()
    })
  }

  /**
   * Calculate compression ratio based on quality setting
   */
  private calculateCompressionRatio(quality: CompressionOptions['quality']): number {
    switch (quality) {
      case 'low':
        return 0.3 // 30% of original size
      case 'medium':
        return 0.5 // 50% of original size
      case 'high':
        return 0.7 // 70% of original size
      default:
        return 0.5
    }
  }

  /**
   * Validate video file before compression
   */
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('video/')) {
      return { valid: false, error: 'File must be a video' }
    }

    // Check file size (max 500MB for processing)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Maximum 500MB allowed.' }
    }

    // Check supported formats
    const supportedFormats = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/quicktime']
    if (!supportedFormats.includes(file.type)) {
      return { valid: false, error: 'Unsupported video format. Please use MP4, WebM, AVI, or MOV.' }
    }

    return { valid: true }
  }

  /**
   * Get optimal compression settings based on file size and target
   */
  getOptimalSettings(fileSize: number, targetSize: number): CompressionOptions {
    const ratio = targetSize / fileSize
    
    let quality: CompressionOptions['quality'] = 'medium'
    if (ratio <= 0.3) {
      quality = 'low'
    } else if (ratio >= 0.7) {
      quality = 'high'
    }

    return {
      quality,
      maxSize: targetSize,
      format: 'mp4' // Default to MP4 for best compatibility
    }
  }
}

// Export singleton instance
export const videoCompressor = VideoCompressor.getInstance()

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
