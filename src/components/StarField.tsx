import { useEffect, useRef, useMemo, useState } from 'react'
import gsap from 'gsap'

interface Star {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
}

interface StarFieldProps {
  count?: number
  speed?: number
}

const MOBILE_BREAKPOINT = 768

export default function StarField({ count = 50, speed = 1 }: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const mobileCount = Math.min(count, 8)
  const effectiveCount = isMobile ? mobileCount : count

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
    }))
  }, [effectiveCount])

  useEffect(() => {
    if (isMobile) return

    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const animations: gsap.core.Animation[] = []

    starsRef.current.forEach((star, index) => {
      if (!star) return

      const starData = stars[index]
      
      gsap.set(star, {
        xPercent: -50,
        y: -20,
        opacity: 0,
      })

      const tl = gsap.timeline({ repeat: -1, delay: starData.delay })
      
      tl.to(star, {
        y: window.innerHeight + 20,
        opacity: starData.opacity,
        duration: starData.duration / speed,
        ease: 'none',
      })
      .to(star, {
        opacity: 0,
        duration: 0.3,
      }, '-=0.3')

      animations.push(tl)
    })

    const handleVisibility = () => {
      animations.forEach((anim) => {
        if (document.hidden) anim.pause()
        else anim.resume()
      })
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      animations.forEach((anim) => anim.kill())
    }
  }, [stars, speed, isMobile])

  if (isMobile) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${star.opacity}) 0%, rgba(200, 230, 255, ${star.opacity * 0.8}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
              animation: `starfall ${star.duration / speed}s ${star.delay}s linear infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star, index) => (
        <div
          key={star.id}
          ref={(el) => {
            if (el) starsRef.current[index] = el
          }}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${star.opacity}) 0%, rgba(200, 230, 255, ${star.opacity * 0.8}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
          }}
        />
      ))}
    </div>
  )
}
