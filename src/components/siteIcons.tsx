import type { ComponentType, SVGProps } from 'react'

export type SiteIcon = ComponentType<SVGProps<SVGSVGElement>>

type IconProps = SVGProps<SVGSVGElement>

function BaseSiteIcon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.72}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 3.1L18.3 5.7 20.7 12l-2.4 6.3L12 20.9 5.7 18.3 3.3 12l2.4-6.3Z" opacity="0.34" />
      <path d="M8.1 6.8h7.8" opacity="0.32" />
      <path d="M6.9 17.2h10.2" opacity="0.32" />
      {children}
    </svg>
  )
}

export function HomePavilionIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M4.8 11.4L12 5.7l7.2 5.7" />
      <path d="M6.6 10.8V18h10.8v-7.2" />
      <path d="M4.2 11.4h15.6" />
      <path d="M8.2 8.6h7.6" />
      <path d="M10.2 18v-4.1h3.6V18" />
    </BaseSiteIcon>
  )
}

export function HallOfAchievementIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M4.6 8.4h14.8" />
      <path d="M3.8 18.2h16.4" />
      <path d="M5 8.4L12 4.8l7 3.6" />
      <path d="M6.8 10v7" />
      <path d="M9.9 10v7" />
      <path d="M13 10v7" />
      <path d="M16.1 10v7" />
      <path d="M4.7 19.9h14.6" />
    </BaseSiteIcon>
  )
}

export function ScientistPortraitIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <circle cx="12" cy="8.2" r="2.2" />
      <path d="M8 18.1c.8-2.8 2.2-4.3 4-4.3s3.2 1.5 4 4.3" />
      <path d="M4.8 18.1h14.4" />
      <path d="M15.8 6.3l2.4-1.1" />
      <path d="M16.4 8.5h2.8" />
      <path d="M15.9 10.6l2.3 1.1" />
      <path d="M8.8 6.2l1.1 1.5" />
      <path d="M10.1 12.6l-1.8 2.2" />
    </BaseSiteIcon>
  )
}

export function TreatiseScrollIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M7.2 5.4h7.6a2.5 2.5 0 0 1 2.5 2.5v10.2" />
      <path d="M7.2 5.4a2.8 2.8 0 0 0-2.8 2.8v8a2.8 2.8 0 0 0 2.8 2.8h9.6" />
      <path d="M7.4 8.8h6.8" />
      <path d="M7.4 12h6" />
      <path d="M7.4 15.2h4.7" />
      <path d="M15.8 7.2h3.1" />
      <path d="M17.3 5.7v3" />
    </BaseSiteIcon>
  )
}

export function CultureWindowIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M6.4 18.2V6.8" />
      <path d="M17.6 18.2V6.8" />
      <path d="M4.9 18.2h14.2" />
      <path d="M5.7 6.8L12 4.6l6.3 2.2" />
      <path d="M9 9.4h6" />
      <path d="M9 12.3h6" />
      <path d="M9 15.2h6" />
    </BaseSiteIcon>
  )
}

export function GalleryImageIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <rect x="4.8" y="5.6" width="14.4" height="11.2" rx="1.8" />
      <circle cx="15.2" cy="9.1" r="1.2" />
      <path d="M7.3 14l2.8-2.9 2.3 2 3.5-3.6" />
      <path d="M7.3 16.1h9.4" />
      <path d="M9.2 19.4h5.6" />
    </BaseSiteIcon>
  )
}

export function CommentPlaqueIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M6.8 6.6h10.1A2.8 2.8 0 0 1 19.7 9.4v3.7a2.8 2.8 0 0 1-2.8 2.8H10l-3.7 2v-2h-.5A2.8 2.8 0 0 1 3 13.1V9.4a2.8 2.8 0 0 1 2.8-2.8Z" />
      <path d="M7.5 10.2h7.4" />
      <path d="M7.5 13h4.8" />
    </BaseSiteIcon>
  )
}

export function QuizPlaqueIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M5.4 6.2h8.8a2.6 2.6 0 0 1 2.6 2.6v8.8H8a2.6 2.6 0 0 1-2.6-2.6V6.2Z" />
      <path d="M16.8 8.6h1.8a1.8 1.8 0 0 1 1.8 1.8v5a1.8 1.8 0 0 1-1.8 1.8h-1.8" />
      <path d="M9 10a2.3 2.3 0 1 1 3.8 1.7c-.7.5-1.1 1-1.1 1.7" />
      <path d="M11.7 15.8h.1" />
    </BaseSiteIcon>
  )
}

export function ProfileSealIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <circle cx="12" cy="8.9" r="2.7" />
      <path d="M6.7 18.2c1.1-2.5 3-3.9 5.3-3.9s4.2 1.4 5.3 3.9" />
      <path d="M4.8 18.2h14.4" />
    </BaseSiteIcon>
  )
}

export function TrainingPuzzleIcon(props: IconProps) {
  return (
    <BaseSiteIcon {...props}>
      <path d="M7.2 6.2h3.2a1.8 1.8 0 0 1 1.8 1.8v1.1h1.1a1.8 1.8 0 0 1 1.8 1.8v1.2h1.7a1.8 1.8 0 0 1 1.8 1.8v4.1H6.4v-4.1a1.8 1.8 0 0 1 1.8-1.8h1.5v-1.2A1.8 1.8 0 0 1 11.5 9h.7V8a1.8 1.8 0 0 0-1.8-1.8H7.2Z" />
      <path d="M9.6 12.1h4.8" />
      <path d="M12 9.7v4.8" />
      <path d="M7.4 17.9h9.2" />
    </BaseSiteIcon>
  )
}

export function AIAssistantIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={props.className}
      {...props}
    >
      <image 
        href="/images/ai/ai助手.svg" 
        width="24" 
        height="24" 
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  )
}
