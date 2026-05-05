import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function BaseUiIcon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.82}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M6.2 5.7h11.6" opacity="0.24" />
      <path d="M5 18.3h14" opacity="0.18" />
      {children}
    </svg>
  )
}

export function ArrowRight(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.5 12h14.2" /><path d="M14.2 7.9l4.3 4.1-4.3 4.1" /></BaseUiIcon> }
export function ArrowLeft(props: IconProps) { return <BaseUiIcon {...props}><path d="M19.5 12H5.3" /><path d="M9.8 7.9L5.5 12l4.3 4.1" /></BaseUiIcon> }
export function ArrowUpRight(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.2 16.8L17 7" /><path d="M10 7h7v7" /></BaseUiIcon> }
export function ArrowDown(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.8v14.4" /><path d="M7.9 15L12 19.2l4.1-4.2" /></BaseUiIcon> }
export function ArrowUpDown(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.8v14.4" /><path d="M8.9 7.9L12 4.8l3.1 3.1" /><path d="M15.1 16.9 12 20l-3.1-3.1" /></BaseUiIcon> }
export function ChevronDown(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.8 9.1 12 14.3l5.2-5.2" /></BaseUiIcon> }
export function ChevronUp(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.8 14.9 12 9.7l5.2 5.2" /></BaseUiIcon> }
export function ChevronRight(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.1 6.8 14.3 12l-5.2 5.2" /></BaseUiIcon> }
export function X(props: IconProps) { return <BaseUiIcon {...props}><path d="M7 7l10 10" /><path d="M17 7 7 17" /></BaseUiIcon> }
export function Check(props: IconProps) { return <BaseUiIcon {...props}><path d="M5.8 12.4l4.1 4.1 8.3-8.7" /></BaseUiIcon> }
export function CheckCircle(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.5" /><path d="M8.7 12.1l2.2 2.3 4.5-4.8" /></BaseUiIcon> }
export function CheckCircle2(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.4a7.6 7.6 0 1 1-7.6 7.6" /><path d="M8.7 12.1l2.2 2.3 4.5-4.8" /></BaseUiIcon> }
export function XCircle(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.5" /><path d="M9.3 9.3l5.4 5.4" /><path d="M14.7 9.3l-5.4 5.4" /></BaseUiIcon> }
export function AlertCircle(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.5" /><path d="M12 8.1v5.2" /><path d="M12 16.2h.1" /></BaseUiIcon> }
export function Info(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.5" /><path d="M12 10.6v4.9" /><path d="M12 7.9h.1" /></BaseUiIcon> }
export function Heart(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 18.4s-6.4-4.2-6.4-8.5c0-2 1.4-3.6 3.4-3.6 1.4 0 2.4.7 3 1.8.6-1.1 1.6-1.8 3-1.8 2 0 3.4 1.6 3.4 3.6 0 4.3-6.4 8.5-6.4 8.5Z" /></BaseUiIcon> }
export function Link2(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.3 14.7 7.8 16.2a3 3 0 1 1-4.2-4.2L6 9.6a3 3 0 0 1 4.2 0" /><path d="M14.7 9.3l1.5-1.5a3 3 0 1 1 4.2 4.2L18 14.4a3 3 0 0 1-4.2 0" /><path d="M8.8 15.2l6.4-6.4" /></BaseUiIcon> }
export function Share2(props: IconProps) { return <BaseUiIcon {...props}><circle cx="7" cy="12.4" r="1.6" /><circle cx="17.2" cy="7.2" r="1.6" /><circle cx="17.2" cy="17.6" r="1.6" /><path d="M8.5 11.6 15.7 8" /><path d="M8.5 13.2l7.2 3.2" /></BaseUiIcon> }
export function Download(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 5v9.5" /><path d="M8.4 11.1 12 14.7l3.6-3.6" /><path d="M5.2 18.6h13.6" /></BaseUiIcon> }
export function LayoutGrid(props: IconProps) { return <BaseUiIcon {...props}><rect x="5.1" y="5.1" width="5.3" height="5.3" rx="1.1" /><rect x="13.6" y="5.1" width="5.3" height="5.3" rx="1.1" /><rect x="5.1" y="13.6" width="5.3" height="5.3" rx="1.1" /><rect x="13.6" y="13.6" width="5.3" height="5.3" rx="1.1" /></BaseUiIcon> }
export function LayoutDashboard(props: IconProps) { return <BaseUiIcon {...props}><rect x="4.9" y="5.3" width="5.6" height="13.4" rx="1.2" /><rect x="13.5" y="5.3" width="5.6" height="6" rx="1.2" /><rect x="13.5" y="13.4" width="5.6" height="5.3" rx="1.2" /></BaseUiIcon> }
export function Layers3(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 5l7 3.9-7 3.9-7-3.9Z" /><path d="M5 12.3l7 3.9 7-3.9" /><path d="M5 15.7l7 3.9 7-3.9" /></BaseUiIcon> }
export function BarChart3(props: IconProps) { return <BaseUiIcon {...props}><path d="M5.2 18.2h13.6" /><path d="M7.4 16.8V11" /><path d="M12 16.8V7.6" /><path d="M16.6 16.8V9.4" /></BaseUiIcon> }
export function Network(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="6.5" r="1.5" /><circle cx="6.4" cy="16.5" r="1.5" /><circle cx="17.6" cy="16.5" r="1.5" /><path d="M12 8v3.1" /><path d="M10.7 10.7L7.5 15" /><path d="M13.3 10.7l3.2 4.3" /><path d="M7.9 16.5h8.2" /></BaseUiIcon> }
export function Brain(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.3 6.1a2.5 2.5 0 0 0-3.5 2.3c0 .8.4 1.6 1 2.1a2.8 2.8 0 0 0-.2 5.5 2.7 2.7 0 0 0 4 1.7" /><path d="M14.7 6.1a2.5 2.5 0 0 1 3.5 2.3c0 .8-.4 1.6-1 2.1a2.8 2.8 0 0 1 .2 5.5 2.7 2.7 0 0 1-4 1.7" /><path d="M12 5.2v13.6" /><path d="M9.6 9.2h2.4" /><path d="M12 12h2.5" /></BaseUiIcon> }
export function BrainCircuit(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.2 6.1a2.5 2.5 0 0 0-3.4 2.3c0 .8.3 1.5.9 2" /><path d="M14.8 6.1a2.5 2.5 0 0 1 3.4 2.3c0 .8-.3 1.5-.9 2" /><path d="M7 10.4v4.2" /><path d="M17 10.4v4.2" /><path d="M12 5.4v5.3" /><path d="M10 10.7h4" /><path d="M8.7 15.2h6.6" /><circle cx="7" cy="15.3" r="1.1" /><circle cx="17" cy="15.3" r="1.1" /><circle cx="12" cy="12.8" r="1.1" /></BaseUiIcon> }
export function Menu(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 7.2h14.4" /><path d="M4.8 12h14.4" /><path d="M4.8 16.8h14.4" /></BaseUiIcon> }
export function Moon(props: IconProps) { return <BaseUiIcon {...props}><path d="M15.8 4.9a6.8 6.8 0 1 0 3.2 12.7A7.6 7.6 0 1 1 15.8 4.9Z" /></BaseUiIcon> }
export function Sun(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="3.1" /><path d="M12 4.5v2.1" /><path d="M12 17.4v2.1" /><path d="M4.5 12h2.1" /><path d="M17.4 12h2.1" /><path d="M6.8 6.8l1.5 1.5" /><path d="M15.7 15.7l1.5 1.5" /><path d="M17.2 6.8l-1.5 1.5" /><path d="M8.3 15.7l-1.5 1.5" /></BaseUiIcon> }
export function User(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="8.4" r="2.5" /><path d="M6.8 18.1c1-2.5 2.9-3.8 5.2-3.8s4.2 1.3 5.2 3.8" /></BaseUiIcon> }
export function User2(props: IconProps) { return <BaseUiIcon {...props}><circle cx="11.2" cy="8.4" r="2.4" /><path d="M5.8 18.1c1-2.4 2.9-3.8 5.4-3.8 2 0 3.8.9 4.9 2.5" /><path d="M17 9.2c1.1.4 1.9 1.4 1.9 2.7" /></BaseUiIcon> }
export function Loader2(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.7a7.3 7.3 0 1 0 7.3 7.3" /><path d="M12 4.7a7.3 7.3 0 0 1 6.3 3.6" /></BaseUiIcon> }
export function RotateCcw(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.2 8H4V4.8" /><path d="M4.3 8.2A7.5 7.5 0 1 1 6.7 17" /></BaseUiIcon> }
export function Send(props: IconProps) { return <BaseUiIcon {...props}><path d="M20 5 10.2 14.8" /><path d="M20 5 14.2 19l-3.2-5.8L5 10z" /></BaseUiIcon> }
export function Sparkles(props: IconProps) { return <BaseUiIcon {...props}><path d="M11.8 4.6l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" /><path d="M17.3 12.6l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6Z" /><path d="M6.7 13.5l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6Z" /></BaseUiIcon> }
export function MessageSquare(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.6 6.7h10.8A2.5 2.5 0 0 1 19.9 9.2v3.7a2.5 2.5 0 0 1-2.5 2.5H10l-3.6 2v-2h-.5a2.5 2.5 0 0 1-2.5-2.5V9.2a2.5 2.5 0 0 1 2.5-2.5Z" /></BaseUiIcon> }
export function Pencil(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.2 17.8l3.2-.8 8-8a1.7 1.7 0 0 0-2.4-2.4l-8 8Z" /><path d="M13.8 6.4l3.8 3.8" /></BaseUiIcon> }
export function ThumbsUp(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.3 10.2V6.5c0-.9.7-1.7 1.6-1.7l.7 4.4h4.3a1.9 1.9 0 0 1 1.9 2.4l-1.3 5.2a2 2 0 0 1-1.9 1.5H8.4a2 2 0 0 1-2-2v-4.9a1.4 1.4 0 0 1 1.4-1.4Z" /><path d="M4.8 10.2h2.6v8.4H4.8Z" /></BaseUiIcon> }
export function Trash2(props: IconProps) { return <BaseUiIcon {...props}><path d="M5.9 7.1h12.2" /><path d="M9.1 7.1V5.4h5.8v1.7" /><path d="M7.3 7.1l.8 11h7.8l.8-11" /><path d="M10.2 10v5.2" /><path d="M13.8 10v5.2" /></BaseUiIcon> }
export function Users(props: IconProps) { return <BaseUiIcon {...props}><circle cx="9" cy="9" r="2.1" /><circle cx="15.8" cy="9.7" r="1.8" /><path d="M5.8 17.8c.8-2.2 2.1-3.4 4-3.4s3.2 1.2 4 3.4" /><path d="M14 17.6c.5-1.4 1.5-2.3 3-2.3.9 0 1.7.3 2.3.9" /></BaseUiIcon> }
export function Flame(props: IconProps) { return <BaseUiIcon {...props}><path d="M12.1 4.8c1.7 2 3.5 3.8 3.5 6.2a3.6 3.6 0 0 1-7.2 0c0-1.6.9-2.9 2-4.2-.2 1.7.9 2.4 1.7 3.2.5-.9.5-2 0-3.2Z" /><path d="M12 11.3c1 .8 1.8 1.7 1.8 3a1.8 1.8 0 1 1-3.6 0c0-.8.6-1.5 1.3-2.2" /></BaseUiIcon> }
export function Search(props: IconProps) { return <BaseUiIcon {...props}><circle cx="10.5" cy="10.5" r="4.7" /><path d="M14.1 14.1l4.4 4.4" /></BaseUiIcon> }
export function SlidersHorizontal(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.6 7.2h14.8" /><path d="M4.6 12h14.8" /><path d="M4.6 16.8h14.8" /><circle cx="8" cy="7.2" r="1.5" /><circle cx="15.8" cy="12" r="1.5" /><circle cx="11.2" cy="16.8" r="1.5" /></BaseUiIcon> }
export function BookMarked(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.5 5.2h8.7a2.3 2.3 0 0 1 2.3 2.3v11" /><path d="M6.5 5.2A2.5 2.5 0 0 0 4 7.7v7.9a2.5 2.5 0 0 0 2.5 2.5h11" /><path d="M8.4 8.2h5.5" /><path d="M8.4 11.3h5.2" /><path d="M8.7 5.5v4l1.8-1.2 1.9 1.2v-4" /></BaseUiIcon> }
export function Bookmark(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.4 5.3h9.2v13L12 15.5l-4.6 2.8Z" /></BaseUiIcon> }
export function BookOpen(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 6.4c1.8-.8 3.6-1.1 5.4-1.1 1.5 0 3 .3 4.5 1.1" /><path d="M4.8 17.7c1.8-.8 3.6-1.1 5.4-1.1 1.5 0 3 .3 4.5 1.1" /><path d="M4.8 6.4v11.3" /><path d="M19.2 6.4v11.3" /><path d="M12 6.1v11.6" /></BaseUiIcon> }
export function BookOpenText(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 6.4c1.8-.8 3.6-1.1 5.4-1.1 1.5 0 3 .3 4.5 1.1" /><path d="M4.8 17.7c1.8-.8 3.6-1.1 5.4-1.1 1.5 0 3 .3 4.5 1.1" /><path d="M4.8 6.4v11.3" /><path d="M19.2 6.4v11.3" /><path d="M13.8 9h3.2" /><path d="M13.8 11.8h3.2" /></BaseUiIcon> }
export function ScrollText(props: IconProps) { return <BaseUiIcon {...props}><path d="M7 5.2h8.4a2.4 2.4 0 0 1 2.4 2.4v10.2" /><path d="M7 5.2A2.8 2.8 0 0 0 4.2 8v7.2A2.8 2.8 0 0 0 7 18h10" /><path d="M7.9 8.6h6.1" /><path d="M7.9 11.6h5.4" /><path d="M7.9 14.6h4.1" /><path d="M17.1 5.7v3" /></BaseUiIcon> }
export function FileText(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.2 4.9h7.4l3 3v10.8H7.2Z" /><path d="M14.6 4.9v3.2h3" /><path d="M9 11h6" /><path d="M9 13.8h6" /><path d="M9 16.6h4.2" /></BaseUiIcon> }
export function LibraryBig(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.4 8.3h15.2" /><path d="M3.8 18.6h16.4" /><path d="M5.1 8.3L12 4.7l6.9 3.6" /><path d="M6.6 10.2v6.3" /><path d="M10 10.2v6.3" /><path d="M14 10.2v6.3" /><path d="M17.4 10.2v6.3" /></BaseUiIcon> }
export function Quote(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.1 10.1h3.1v3.3H7a3.1 3.1 0 0 1 3-3.3V8.9" /><path d="M13.8 10.1h3.1v3.3h-3.2a3.1 3.1 0 0 1 3-3.3V8.9" /></BaseUiIcon> }
export function Wrench(props: IconProps) { return <BaseUiIcon {...props}><path d="M14.6 6.3a3.3 3.3 0 0 0 3.8 4.3l-7.1 7.1-2.9-.8-.8-2.9 7.1-7.1a3.3 3.3 0 0 0-.1-.6Z" /></BaseUiIcon> }
export function Landmark(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 8.1h14.4" /><path d="M4.2 18.3h15.6" /><path d="M5.2 8.1L12 4.8l6.8 3.3" /><path d="M7 9.7v6.8" /><path d="M10.2 9.7v6.8" /><path d="M13.8 9.7v6.8" /><path d="M17 9.7v6.8" /></BaseUiIcon> }
export function Compass(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.7" /><path d="M14.9 9.1l-1.8 5-5 1.8 1.8-5Z" /><circle cx="12" cy="12" r="1" /></BaseUiIcon> }
export function Map(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 6.8l4-1.8 6.4 1.8 4-1.8v12.2l-4 1.8-6.4-1.8-4 1.8Z" /><path d="M8.8 5v12.2" /><path d="M15.2 6.8V19" /></BaseUiIcon> }
export function Trees(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.3 16.8V13" /><path d="M5.1 13l2.2-3 2.2 3Z" /><path d="M7.3 10.1l-2-2.8 2-2.8 2 2.8Z" /><path d="M15.6 16.8V12.8" /><path d="M12.8 12.8l2.8-3.8 2.8 3.8Z" /><path d="M15.6 9.2l-2.3-3.1 2.3-3.1 2.3 3.1Z" /></BaseUiIcon> }
export function Waves(props: IconProps) { return <BaseUiIcon {...props}><path d="M3.8 9.3c1.4 0 1.4-.8 2.8-.8s1.4.8 2.8.8 1.4-.8 2.8-.8 1.4.8 2.8.8 1.4-.8 2.8-.8" /><path d="M3.8 12.7c1.4 0 1.4-.8 2.8-.8s1.4.8 2.8.8 1.4-.8 2.8-.8 1.4.8 2.8.8 1.4-.8 2.8-.8" /><path d="M3.8 16.1c1.4 0 1.4-.8 2.8-.8s1.4.8 2.8.8 1.4-.8 2.8-.8 1.4.8 2.8.8 1.4-.8 2.8-.8" /></BaseUiIcon> }
export function Puzzle(props: IconProps) { return <BaseUiIcon {...props}><path d="M8 5.3h4v2a1.4 1.4 0 1 0 2.8 0v-2h3.9v4h-2a1.4 1.4 0 1 0 0 2.8h2v4h-4v-2a1.4 1.4 0 1 0-2.8 0v2H8v-4h2a1.4 1.4 0 1 0 0-2.8H8Z" /></BaseUiIcon> }
export function SortAsc(props: IconProps) { return <BaseUiIcon {...props}><path d="M7.4 17.8V6.2" /><path d="M5.2 8.4l2.2-2.2 2.2 2.2" /><path d="M13.2 8h5.6" /><path d="M13.2 12h4.2" /><path d="M13.2 16h2.8" /></BaseUiIcon> }
export function MapPin(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 19.2s4.9-4.2 4.9-8.2A4.9 4.9 0 1 0 7.1 11c0 4 4.9 8.2 4.9 8.2Z" /><circle cx="12" cy="11" r="1.7" /></BaseUiIcon> }
export function Play(props: IconProps) { return <BaseUiIcon {...props}><path d="M9 7.2v9.6l7.8-4.8Z" /></BaseUiIcon> }
export function Hammer(props: IconProps) { return <BaseUiIcon {...props}><path d="M14.2 5.2l4.3 4.3" /><path d="M12.9 6.5l2.6-2.6 3.2 3.2-2.6 2.6" /><path d="M11.4 8l-6.7 6.7" /><path d="M6.1 16.2l1.7 1.7" /></BaseUiIcon> }
export function Orbit(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="1.6" /><path d="M5.5 12a8.8 4.3 0 1 0 13 0 8.8 4.3 0 1 0-13 0" /><path d="M9.2 6.3a8.5 4 56 1 0 5.6 11.4A8.5 4 56 1 0 9.2 6.3" /></BaseUiIcon> }
export function ShieldCheck(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.7 18 7v4.8c0 3.2-2.2 6-6 7.5-3.8-1.5-6-4.3-6-7.5V7Z" /><path d="M9.1 11.8l1.9 2 3.9-4.2" /></BaseUiIcon> }
export function Stars(props: IconProps) { return <BaseUiIcon {...props}><path d="M11.8 4.6l.7 2.1 2.2.7-2.2.7-.7 2.1-.7-2.1-2.2-.7 2.2-.7Z" /><path d="M17.1 10.6l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5Z" /><path d="M7.1 11.7l.8 2.2 2.3.8-2.3.8-.8 2.2-.8-2.2-2.3-.8 2.3-.8Z" /></BaseUiIcon> }
export function Home(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.8 11.2L12 5.6l7.2 5.6" /><path d="M6.5 10.8V18h11v-7.2" /><path d="M10.2 18v-4h3.6v4" /></BaseUiIcon> }
export function Image(props: IconProps) { return <BaseUiIcon {...props}><rect x="4.8" y="5.5" width="14.4" height="11.6" rx="1.8" /><circle cx="15.5" cy="9.1" r="1.2" /><path d="M7.4 14.4l2.7-2.9 2.5 2.2 3.7-3.8" /></BaseUiIcon> }
export function ImageIcon(props: IconProps) { return <Image {...props} /> }
export function ExternalLink(props: IconProps) { return <BaseUiIcon {...props}><path d="M9.1 8.4H6.2v9.4h9.4v-2.9" /><path d="M12.4 6.2h5.4v5.4" /><path d="M11.1 12.9l6.7-6.7" /></BaseUiIcon> }
export function MoveRight(props: IconProps) { return <BaseUiIcon {...props}><path d="M4.2 12h14.6" /><path d="M14.5 8l4.3 4-4.3 4" /></BaseUiIcon> }
export function TimerReset(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 7.2v5l3.2 1.8" /><path d="M8.2 4.8h7.6" /><path d="M19 7.4V4.8h-2.6" /><path d="M18.6 11.1A6.6 6.6 0 1 1 7.1 8L4.8 9.9" /></BaseUiIcon> }
export function Eye(props: IconProps) { return <BaseUiIcon {...props}><path d="M3.8 12s3-5 8.2-5 8.2 5 8.2 5-3 5-8.2 5-8.2-5-8.2-5Z" /><circle cx="12" cy="12" r="2.2" /></BaseUiIcon> }
export function Grid3X3(props: IconProps) { return <LayoutGrid {...props} /> }
export function RefreshCw(props: IconProps) { return <BaseUiIcon {...props}><path d="M19 7.4V4.8h-2.6" /><path d="M5 16.6v2.6h2.6" /><path d="M18.5 11A6.6 6.6 0 0 0 7.6 6.1L5 8.2" /><path d="M5.5 13A6.6 6.6 0 0 0 16.4 17.9l2.6-2.1" /></BaseUiIcon> }
export function Target(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="4.3" /><circle cx="12" cy="12" r="1.4" /></BaseUiIcon> }
export function Trophy(props: IconProps) { return <BaseUiIcon {...props}><path d="M8.2 5.4h7.6v2.3a3.8 3.8 0 0 1-7.6 0Z" /><path d="M8.2 6.2H5.8a2 2 0 0 0 2 2.4h.8" /><path d="M15.8 6.2h2.4a2 2 0 0 1-2 2.4h-.8" /><path d="M12 11.5v3.2" /><path d="M8.8 18.1h6.4" /><path d="M9.7 14.7h4.6" /></BaseUiIcon> }
export function BadgeCheck(props: IconProps) { return <BaseUiIcon {...props}><path d="M12 4.8l1.6 1 1.9-.3 1 1.6 1.7.9-.3 1.9 1 1.6-1 1.6.3 1.9-1.7.9-1 1.6-1.9-.3-1.6 1-1.6-1-1.9.3-1-1.6-1.7-.9.3-1.9-1-1.6 1-1.6-.3-1.9 1.7-.9 1-1.6 1.9.3Z" /><path d="M9.2 12.1l2 2.1 3.7-4.1" /></BaseUiIcon> }
export function Clock3(props: IconProps) { return <BaseUiIcon {...props}><circle cx="12" cy="12" r="7.6" /><path d="M12 7.8v4.5l3 1.6" /></BaseUiIcon> }
export function LogOut(props: IconProps) { return <BaseUiIcon {...props}><path d="M10.2 5.6H6.5v12.8h3.7" /><path d="M13.2 8.4l4.3 3.6-4.3 3.6" /><path d="M8.9 12h8.4" /></BaseUiIcon> }
export function PencilLine(props: IconProps) { return <BaseUiIcon {...props}><path d="M6.1 17.5l3.4-.8 8-8a1.7 1.7 0 0 0-2.4-2.4l-8 8Z" /><path d="M13.8 6l3.8 3.8" /><path d="M5.4 20h13.2" /></BaseUiIcon> }
