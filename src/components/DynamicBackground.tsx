import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

type Intensity = 'hero' | 'feature' | 'detail'

function getIntensity(pathname: string): Intensity {
  if (pathname === '/') return 'hero'
  if (
    pathname.startsWith('/achievement') ||
    pathname.startsWith('/scientists') ||
    pathname.startsWith('/treatises') ||
    pathname.startsWith('/culture') ||
    pathname.startsWith('/gallery')
  ) {
    return 'feature'
  }

  return 'detail'
}

const MOBILE_BREAKPOINT = 768

export default function DynamicBackground() {
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [lowPower, setLowPower] = useState(false)
  const intensity = useMemo(() => getIntensity(location.pathname), [location.pathname])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    const cores = navigator.hardwareConcurrency ?? 8
    setLowPower(memory <= 4 || cores <= 6)
  }, [])

  const shouldAnimate = !isMobile && !lowPower

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !shouldAnimate) {
      gsap.set(root.querySelectorAll('[data-bg-glow], [data-bg-scan], [data-bg-ring], [data-bg-particle]'), { clearProps: 'transform,opacity' })
      return
    }

    const animations: gsap.core.Animation[] = []

    const ctx = gsap.context(() => {
      const glows = gsap.utils.toArray<HTMLElement>('[data-bg-glow]')
      const scans = gsap.utils.toArray<HTMLElement>('[data-bg-scan]')
      const rings = gsap.utils.toArray<HTMLElement>('[data-bg-ring]')
      const particles = gsap.utils.toArray<HTMLElement>('[data-bg-particle]')

      glows.forEach((item, index) => {
        animations.push(
          gsap.to(item, {
            xPercent: index % 2 === 0 ? 6 : -5,
            yPercent: index % 2 === 0 ? -4 : 5,
            scale: index % 2 === 0 ? 1.08 : 0.96,
            duration: 22 + index * 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      })

      rings.forEach((item, index) => {
        animations.push(
          gsap.to(item, {
            rotation: index % 2 === 0 ? 360 : -360,
            duration: 70 + index * 18,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          }),
        )
      })

      scans.forEach((item, index) => {
        const direction = item.dataset.scanDirection === 'reverse' ? -1 : 1
        animations.push(
          gsap.fromTo(
            item,
            {
              xPercent: direction > 0 ? -120 : 120,
              opacity: 0,
            },
            {
              xPercent: direction > 0 ? 120 : -120,
              opacity: item.dataset.scanStrong === 'true' ? 0.9 : 0.6,
              duration: 11 + index * 2.8,
              repeat: -1,
              ease: 'none',
              repeatDelay: intensity === 'hero' ? 0.6 + index * 0.35 : 1.3 + index * 0.45,
            },
          ),
        )
      })

      particles.forEach((item, index) => {
        animations.push(
          gsap.to(item, {
            yPercent: index % 2 === 0 ? -24 : 18,
            xPercent: index % 3 === 0 ? 8 : -6,
            opacity: index % 2 === 0 ? 0.75 : 0.42,
            duration: 12 + (index % 5) * 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      })
    }, root)

    const handleVisibility = () => {
      animations.forEach((animation) => {
        if (document.hidden) animation.pause()
        else animation.resume()
      })
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      ctx.revert()
    }
  }, [shouldAnimate, intensity])

  const particleCount = shouldAnimate ? (intensity === 'hero' ? 9 : intensity === 'feature' ? 6 : 3) : 0
  const showScans = shouldAnimate && intensity !== 'detail'
  const showSecondaryScan = shouldAnimate && intensity !== 'detail'
  const showRings = shouldAnimate
  const showCoolGlow = !isMobile
  const showThirdRing = !isMobile && shouldAnimate && intensity === 'hero'

  return (
    <div ref={rootRef} className="dynamic-bg dynamic-bg--cinematic" data-bg-intensity={intensity} aria-hidden="true">
      <div className="dynamic-bg__photo" />
      <div className="dynamic-bg__base" />
      <div className="dynamic-bg__vignette" />
      <div className="dynamic-bg__structure" />

      <div className="dynamic-bg__glow dynamic-bg__glow--warm" data-bg-glow />
      {showCoolGlow ? <div className="dynamic-bg__glow dynamic-bg__glow--cool" data-bg-glow /> : null}
      <div className="dynamic-bg__glow dynamic-bg__glow--ember" data-bg-glow />

      {showRings ? (
        <>
          <div className="dynamic-bg__ring dynamic-bg__ring--outer" data-bg-ring />
          <div className="dynamic-bg__ring dynamic-bg__ring--mid" data-bg-ring />
          {showThirdRing ? <div className="dynamic-bg__ring dynamic-bg__ring--inner" data-bg-ring /> : null}
        </>
      ) : null}

      {showScans ? (
        <>
          <div className="dynamic-bg__scan dynamic-bg__scan--gold" data-bg-scan data-scan-strong="true" />
          {showSecondaryScan ? <div className="dynamic-bg__scan dynamic-bg__scan--blue" data-bg-scan data-scan-direction="reverse" /> : null}
        </>
      ) : null}

      <div className="dynamic-bg__axis dynamic-bg__axis--x" />
      <div className="dynamic-bg__axis dynamic-bg__axis--y" />

      {particleCount > 0 ? (
        <div className="dynamic-bg__particles">
          {Array.from({ length: particleCount }).map((_, index) => (
            <span
              key={`dynamic-particle-${index}`}
              data-bg-particle
              className="dynamic-bg__particle"
              style={{
                left: `${8 + ((index * 11) % 84)}%`,
                top: `${10 + ((index * 17) % 72)}%`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
