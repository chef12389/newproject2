import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  fallback?: React.ReactNode
  onLoad?: () => void
  onError?: () => void
  width?: number
  height?: number
  quality?: number
  sizes?: string
  showLoadedOverlay?: boolean
}

const MOBILE_BREAKPOINT = 768

export function LazyImage({
  src,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
  priority = false,
  fallback,
  onLoad,
  onError,
  width = 800,
  height = 600,
  quality = 80,
  sizes = '100vw',
  showLoadedOverlay = true,
}: LazyImageProps) {
  const [isMobile, setIsMobile] = useState(false)
  const normalizedQuality = isMobile ? Math.min(quality, 60) : Math.min(100, Math.max(1, quality))
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const [showFallback, setShowFallback] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const fallbackUrl = getImageUrl('images/huanggong/huanggong.jpeg')
  const imageUrl = getImageUrl(src)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsLoaded(false)
    setShowFallback(false)
    setCurrentSrc(imageUrl)
  }, [imageUrl])

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const rootMargin = isMobile ? '100px 0px' : '50px 0px'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    )

    const currentImg = imgRef.current
    if (currentImg) {
      observer.observe(currentImg)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority, isMobile])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    onError?.()
  }

  if (showFallback && fallback) {
    return <div className={cn('flex items-center justify-center bg-muted', className)}>{fallback}</div>
  }

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={cn('bg-muted animate-pulse', className)}
        style={{ minHeight: '200px' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
        </div>
      )}

      <motion.img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        width={width}
        height={height}
        sizes={sizes}
        data-quality={normalizedQuality}
        onLoad={() => {
          handleLoad()
        }}
        onError={() => {
          if (currentSrc !== fallbackUrl) {
            setCurrentSrc(fallbackUrl)
            return
          }

          setShowFallback(true)
          handleError()
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className={cn('h-full w-full object-cover transition-transform duration-700', !isLoaded && 'blur-sm', imgClassName)}
        style={{ aspectRatio: `${width} / ${height}` }}
      />

      {isLoaded && showLoadedOverlay && !isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"
        />
      )}
    </div>
  )
}
