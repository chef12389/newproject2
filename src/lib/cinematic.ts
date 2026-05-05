import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let gsapRegistered = false

const MOBILE_BREAKPOINT = 768

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
}

function ensureGsap() {
  if (!gsapRegistered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    gsapRegistered = true
  }
}

function applyImmediateState(targets: Element[], props: gsap.TweenVars) {
  if (!targets.length) return
  gsap.set(targets, props)
}

export function useCinematicHero(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    ensureGsap()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobile()
    const ctx = gsap.context(() => {
      const atmosphere = gsap.utils.toArray<HTMLElement>('[data-cine-atmosphere]')
      const titleLines = gsap.utils.toArray<HTMLElement>('[data-cine-title-line]')
      const copy = gsap.utils.toArray<HTMLElement>('[data-cine-copy]')
      const actions = gsap.utils.toArray<HTMLElement>('[data-cine-actions]')
      const strip = gsap.utils.toArray<HTMLElement>('[data-cine-strip] > *')
      const spotlight = gsap.utils.toArray<HTMLElement>('[data-cine-spotlight]')
      const spotlightImage = gsap.utils.toArray<HTMLElement>('[data-cine-spotlight-image]')
      const glow = gsap.utils.toArray<HTMLElement>('[data-cine-glow]')

      if (reduceMotion) {
        applyImmediateState([...atmosphere, ...titleLines, ...copy, ...actions, ...strip, ...spotlight, ...spotlightImage, ...glow], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
        })
        return
      }

      if (mobile) {
        gsap.set(atmosphere, { opacity: 0, scale: 0.95 })
        gsap.set(titleLines, { opacity: 0, yPercent: 60 })
        gsap.set(copy, { opacity: 0, y: 20 })
        gsap.set(actions, { opacity: 0, y: 16 })
        gsap.set(strip, { opacity: 0, y: 14 })
        gsap.set(spotlight, { opacity: 0, y: 24, scale: 0.97 })
        gsap.set(spotlightImage, { scale: 1.1 })
        gsap.set(glow, { opacity: 0, scale: 0.8 })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(atmosphere, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03 }, 0)
          .to(glow, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06 }, 0.04)
          .to(titleLines, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.1 }, 0.1)
          .to(copy, { opacity: 1, y: 0, duration: 0.5 }, 0.35)
          .to(actions, { opacity: 1, y: 0, duration: 0.4 }, 0.45)
          .to(strip, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06 }, 0.55)
          .to(spotlight, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out' }, 0.2)
          .to(spotlightImage, { scale: 1.03, duration: 0.8, ease: 'power2.out' }, 0.2)

        return
      }

      gsap.set(atmosphere, { opacity: 0, scale: 0.88, filter: 'blur(8px)' })
      gsap.set(titleLines, { opacity: 0, yPercent: 140, rotateX: -24, transformOrigin: '50% 100%', filter: 'blur(6px)' })
      gsap.set(copy, { opacity: 0, y: 32, filter: 'blur(4px)' })
      gsap.set(actions, { opacity: 0, y: 28, filter: 'blur(4px)' })
      gsap.set(strip, { opacity: 0, y: 22, scale: 0.94, filter: 'blur(3px)' })
      gsap.set(spotlight, { opacity: 0, y: 48, scale: 0.94, rotateY: -12, transformOrigin: '0% 50%', filter: 'blur(8px)' })
      gsap.set(spotlightImage, { scale: 1.22, filter: 'saturate(0.88) brightness(0.82)' })
      gsap.set(glow, { opacity: 0, scale: 0.62, filter: 'blur(12px)' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(atmosphere, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.62, stagger: 0.05 }, 0)
        .to(glow, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6, stagger: 0.1 }, 0.08)
        .to(titleLines, { opacity: 1, yPercent: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.08, stagger: 0.16 }, 0.18)
        .to(copy, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.78 }, 0.58)
        .to(actions, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.62 }, 0.72)
        .to(strip, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.56, stagger: 0.1 }, 0.88)
        .to(spotlight, { opacity: 1, y: 0, scale: 1, rotateY: 0, filter: 'blur(0px)', duration: 1.08, ease: 'power4.out' }, 0.32)
        .to(spotlightImage, { scale: 1.03, filter: 'saturate(1.02) brightness(1)', duration: 1.6, ease: 'power2.out' }, 0.32)

      const parallaxLayers = gsap.utils.toArray<HTMLElement>('[data-cine-parallax]')
      parallaxLayers.forEach((layer) => {
        const depth = Number(layer.dataset.cineParallax ?? 0.12)
        gsap.to(layer, {
          yPercent: depth * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef])
}

export function useSectionReveal(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    ensureGsap()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobile()
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-cine-section]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-cine-card]')
      const media = gsap.utils.toArray<HTMLElement>('[data-cine-media]')

      if (reduceMotion) {
        applyImmediateState([...sections, ...cards, ...media], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
        })
        return
      }

      sections.forEach((section) => {
        const children = Array.from(section.querySelectorAll<HTMLElement>('[data-cine-step]'))
        const targets = children.length ? children : [section]
        gsap.set(targets, { opacity: 0, y: mobile ? 10 : 18, scale: mobile ? 1 : 0.992 })
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: mobile ? 0.15 : 0.22,
          stagger: mobile ? 0.02 : 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: mobile ? 'top 88%' : 'top 78%',
            once: true,
          },
        })
      })

      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>('[data-cine-card-image]')
        if (image && !mobile) {
          gsap.set(image, { scale: 1.08, filter: 'saturate(0.92)' })
        }
        gsap.set(card, { opacity: 0, y: mobile ? 12 : 22, scale: mobile ? 1 : 0.99 })
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: mobile ? 0.35 : 0.56,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: mobile ? 'top 90%' : 'top 84%',
            once: true,
          },
        })
        if (image && !mobile) {
          gsap.to(image, {
            scale: 1,
            filter: 'saturate(1)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              once: true,
            },
          })
        }
      })

      media.forEach((item) => {
        gsap.set(item, { opacity: 0, scale: mobile ? 1 : 1.01 })
        gsap.to(item, {
          opacity: 1,
          scale: 1,
          duration: mobile ? 0.12 : 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: mobile ? 'top 90%' : 'top 82%',
            once: true,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef])
}

export function useNavReveal(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    ensureGsap()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobile()
    const ctx = gsap.context(() => {
      const shell = gsap.utils.toArray<HTMLElement>('[data-nav-shell]')
      const logo = gsap.utils.toArray<HTMLElement>('[data-nav-logo]')
      const chips = gsap.utils.toArray<HTMLElement>('[data-nav-chip]')
      const actions = gsap.utils.toArray<HTMLElement>('[data-nav-action]')

      if (reduceMotion) {
        applyImmediateState([...shell, ...logo, ...chips, ...actions], { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 })
        return
      }

      gsap.set(shell, { opacity: 0, y: mobile ? -8 : -18, scale: mobile ? 1 : 0.985 })
      gsap.set(logo, { opacity: 0, x: mobile ? -8 : -16 })
      gsap.set(chips, { opacity: 0, y: mobile ? -6 : -12 })
      gsap.set(actions, { opacity: 0, x: mobile ? 6 : 12 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(shell, { opacity: 1, y: 0, scale: 1, duration: mobile ? 0.35 : 0.58 })
        .to(logo, { opacity: 1, x: 0, duration: mobile ? 0.25 : 0.4 }, 0.06)
        .to(chips, { opacity: 1, y: 0, duration: mobile ? 0.22 : 0.34, stagger: mobile ? 0.025 : 0.045 }, 0.1)
        .to(actions, { opacity: 1, x: 0, duration: mobile ? 0.22 : 0.34, stagger: mobile ? 0.02 : 0.04 }, 0.12)
    }, root)

    return () => ctx.revert()
  }, [rootRef])
}
