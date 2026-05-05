import { type ComponentType, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  BookOpenText,
  Brain,
  ChevronDown,
  Home,
  Image as ImageIcon,
  Landmark,
  LayoutGrid,
  Network,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { type CategoryId } from '@/data/architectureData'
import { PRIMARY_CATEGORY_IDS, orderedCategories } from '@/data/architectureFocus'
import { cn } from '@/lib/utils'

type NavMode = 'navigate' | 'filter'

interface CategoryNavProps {
  activeCategory?: CategoryId
  onCategoryChange?: (category: CategoryId) => void
  mode?: NavMode
  className?: string
  grouped?: boolean
}

const iconMap: Record<CategoryId, ComponentType<{ className?: string }>> = {
  minju: Home,
  guanfu: Landmark,
  huanggong: LayoutGrid,
  qiaoliang: Network,
  shangye: BarChart3,
  jiaoyu: BookOpenText,
  lingmu: Sparkles,
  gonggong: ScrollText,
  yuanlin: ImageIcon,
  zongjiao: Brain,
}

export const CategoryNav = ({
  activeCategory,
  onCategoryChange,
  mode = 'navigate',
  className,
  grouped = false,
}: CategoryNavProps) => {
  const navigate = useNavigate()
  const { type } = useParams<{ type: string }>()
  const [moreOpen, setMoreOpen] = useState(false)

  const current = activeCategory ?? (type as CategoryId)

  const categories = useMemo(
    () =>
      orderedCategories.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.tagline,
        accent: item.accent,
        Icon: iconMap[item.id],
        primary: PRIMARY_CATEGORY_IDS.includes(item.id),
      })),
    [],
  )

  const primaryCategories = categories.filter((item) => item.primary)
  const secondaryCategories = categories.filter((item) => !item.primary)

  const handleClick = (id: CategoryId) => {
    if (mode === 'navigate') {
      navigate(`/architecture/${id}`)
      return
    }

    onCategoryChange?.(id)
  }

  const renderCategoryButton = (cat: (typeof categories)[number]) => {
    const isActive = current === cat.id
    const Icon = cat.Icon

    return (
      <button
        key={cat.id}
        onClick={() => handleClick(cat.id)}
        className={cn(
          'group relative min-w-0 rounded-[22px] border px-4 py-3 text-left transition-all duration-300',
          isActive
            ? 'border-transparent text-white shadow-card dark:text-white'
            : 'border-white/35 bg-white/76 text-foreground hover:border-primary/20 hover:bg-white/92 dark:border-white/10 dark:bg-white/6 dark:hover:bg-white/10',
        )}
        style={isActive ? { background: `linear-gradient(135deg, ${cat.accent}, rgba(20, 24, 36, 0.9))` } : undefined}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl border',
              isActive ? 'border-white/30 bg-white/10 text-white' : 'border-white/40 bg-white/55 text-current dark:border-white/10 dark:bg-white/8',
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-base font-black leading-none text-white">{cat.name}</span>
            <span className={cn('mt-1 block text-xs leading-5', isActive ? 'text-white/78' : 'text-muted-foreground')}>
              {cat.desc}
            </span>
          </span>
        </div>

        {isActive ? <div className="absolute inset-0 rounded-[22px] ring-1 ring-white/22" /> : null}
      </button>
    )
  }

  if (!grouped) {
    return (
      <div className={cn('relative z-20 w-full border border-white/35 bg-background/96 dark:border-white/10', className)}>
        <div className="px-2 py-2 md:px-4">
          <div className="no-scrollbar flex items-stretch gap-2 overflow-x-auto pb-1" style={{ scrollbarGutter: 'stable', scrollSnapType: 'x mandatory' }}>
            {categories.map(renderCategoryButton)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full rounded-[28px] border border-white/35 bg-white/68 p-3 shadow-soft-lift dark:border-white/10 dark:bg-white/5', className)}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{primaryCategories.map(renderCategoryButton)}</div>

        <div className="lg:pl-2">
          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-[22px] border px-4 py-3 text-sm font-semibold transition-all lg:min-w-[170px]',
              moreOpen || secondaryCategories.some((item) => item.id === current)
                ? 'border-primary/15 bg-primary text-white'
                : 'border-white/35 bg-white/76 text-foreground hover:bg-white/90 dark:border-white/10 dark:bg-white/6',
            )}
          >
            更多营造
            <ChevronDown className={cn('h-4 w-4 transition-transform', moreOpen && 'rotate-180')} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {moreOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-3 border-t border-white/20 pt-3 sm:grid-cols-2 xl:grid-cols-3">
              {secondaryCategories.map(renderCategoryButton)}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CategoryNav
