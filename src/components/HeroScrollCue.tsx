import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const toneClass = {
  ember: 'hero-scroll-cue--ember',
  ink: 'hero-scroll-cue--ink',
  paper: 'hero-scroll-cue--paper',
  jade: 'hero-scroll-cue--jade',
} as const

export type HeroScrollCueTone = keyof typeof toneClass

type HeroScrollCueProps = {
  targetId?: string
  tone?: HeroScrollCueTone
  label?: string
  className?: string
}

export function HeroScrollCue({
  targetId = 'main-content',
  tone = 'ember',
  label = '向下展开卷轴',
  className,
}: HeroScrollCueProps) {
  const scrollToMain = () => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={cn('hero-scroll-cue', toneClass[tone], className)}
      onClick={scrollToMain}
      aria-label={label}
    >
      <span className="hero-scroll-cue__rail" aria-hidden>
        <span className="hero-scroll-cue__rail-dot" />
      </span>
      <span className="hero-scroll-cue__text">{label}</span>
      <ArrowDown className="hero-scroll-cue__arrow" aria-hidden />
    </button>
  )
}
