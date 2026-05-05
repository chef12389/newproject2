import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LazyImage } from '@/components/LazyImage'

type ReferenceImageProps = {
  src: string
  alt: string
  title: string
  note: string
  className?: string
  imgClassName?: string
  width?: number
  height?: number
  priority?: boolean
}

export function ReferenceImage({
  src,
  alt,
  title,
  note,
  className,
  imgClassName,
  width = 1200,
  height = 900,
  priority = false,
}: ReferenceImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={cn('overflow-hidden', className)}
      imgClassName={imgClassName}
      width={width}
      height={height}
      quality={90}
      priority={priority}
      fallback={
        <div className="relative flex h-full min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-[inherit] border border-dashed border-white/35 bg-gradient-to-br from-white/85 via-white/72 to-white/58 p-5 text-left dark:border-white/10 dark:from-slate-900/80 dark:via-slate-900/72 dark:to-slate-950/82">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 left-0 h-32 w-32 rounded-full bg-imperial-yellow/10 blur-3xl" />
          <div className="relative z-10 flex items-center gap-2 text-primary">
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em]">Reference Image</span>
          </div>
          <div className="relative z-10 mt-5">
            <div className="text-xl font-black text-foreground">{title}</div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{note}</p>
          </div>
        </div>
      }
    />
  )
}
