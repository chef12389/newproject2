import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchFilters {
  query: string
  dynasty?: string
  region?: string
  category?: string
  hasRating?: boolean
}

interface SearchPanelProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  availableDynasties?: string[]
  availableRegions?: string[]
  availableCategories?: Array<{ id: string; name: string }>
  totalResults?: number
  className?: string
  searchPlaceholder?: string
  filterButtonLabel?: string
  resultLabelFormatter?: (count: number) => string
  booleanFilterTitle?: string
  booleanFilterOnText?: string
  booleanFilterOffText?: string
  showBooleanFilter?: boolean
}

export function SearchPanel({
  filters,
  onChange,
  availableDynasties = [],
  availableRegions = [],
  availableCategories = [],
  totalResults = 0,
  className,
  searchPlaceholder = '搜索建筑名称、朝代或地点...',
  filterButtonLabel = '筛选',
  resultLabelFormatter,
  booleanFilterTitle = '有评分',
  booleanFilterOnText = '仅显示有评分',
  booleanFilterOffText = '全部显示',
  showBooleanFilter = true,
}: SearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localQuery, setLocalQuery] = useState(filters.query)

  useEffect(() => {
    setLocalQuery(filters.query)
  }, [filters.query])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.dynasty) count++
    if (filters.region) count++
    if (filters.category) count++
    if (filters.hasRating) count++
    return count
  }, [filters])

  const updateFilters = (next: Partial<SearchFilters>) => {
    onChange({ ...filters, ...next })
  }

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    updateFilters({ query: localQuery.trim() })
  }

  const clearFilter = (key: keyof SearchFilters) => {
    updateFilters({ [key]: undefined })
  }

  const clearAll = () => {
    onChange({ query: filters.query })
    setIsExpanded(false)
  }

  const hasActiveFilters = activeFiltersCount > 0

  return (
    <div className={cn('space-y-4', className)}>
      <form onSubmit={handleSearch} className="relative">
        <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={localQuery}
            onChange={(event) => {
              const query = event.target.value
              setLocalQuery(query)
              updateFilters({ query })
            }}
            placeholder={searchPlaceholder}
            className="input-surface py-3.5 pl-12 pr-12 placeholder:text-muted-foreground"
          />
          {localQuery && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setLocalQuery('')
                updateFilters({ query: '' })
              }}
              className="premium-icon-button-sm absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </motion.div>
      </form>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn('selection-pill min-h-[44px] gap-2 px-4 py-2 text-sm', (isExpanded || hasActiveFilters) && 'selection-pill-active')}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {filterButtonLabel}
          {activeFiltersCount > 0 && (
            <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 text-xs">{activeFiltersCount}</span>
          )}
        </motion.button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{resultLabelFormatter ? resultLabelFormatter(totalResults) : `找到 ${totalResults} 个结果`}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="surface-card mt-4 space-y-5 rounded-2xl p-5">
              {availableDynasties.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">朝代</div>
                    {filters.dynasty && (
                      <button onClick={() => clearFilter('dynasty')} className="text-xs text-muted-foreground transition-colors hover:text-cinnabar">
                        清除
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableDynasties.map((dynasty) => (
                      <motion.button
                        key={dynasty}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFilters({ dynasty: filters.dynasty === dynasty ? undefined : dynasty })}
                        className={cn('selection-pill px-3 py-1.5 text-xs', filters.dynasty === dynasty && 'selection-pill-active')}
                      >
                        {dynasty}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {availableRegions.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">地区</div>
                    {filters.region && (
                      <button onClick={() => clearFilter('region')} className="text-xs text-muted-foreground transition-colors hover:text-cinnabar">
                        清除
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableRegions.map((region) => (
                      <motion.button
                        key={region}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFilters({ region: filters.region === region ? undefined : region })}
                        className={cn('selection-pill px-3 py-1.5 text-xs', filters.region === region && 'selection-pill-active')}
                      >
                        {region}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {availableCategories.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">类型</div>
                    {filters.category && (
                      <button onClick={() => clearFilter('category')} className="text-xs text-muted-foreground transition-colors hover:text-cinnabar">
                        清除
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFilters({ category: filters.category === category.id ? undefined : category.id })}
                        className={cn('selection-pill px-3 py-1.5 text-xs', filters.category === category.id && 'selection-pill-active')}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {showBooleanFilter && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">{booleanFilterTitle}</div>
                    {filters.hasRating && (
                      <button onClick={() => clearFilter('hasRating')} className="text-xs text-muted-foreground transition-colors hover:text-cinnabar">
                        清除
                      </button>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFilters({ hasRating: !filters.hasRating })}
                    className={cn('selection-pill px-4 py-2 text-xs', filters.hasRating && 'selection-pill-active')}
                  >
                    {filters.hasRating ? booleanFilterOnText : booleanFilterOffText}
                  </motion.button>
                </div>
              )}

              {activeFiltersCount > 0 && (
                <div className="border-t border-border/40 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAll}
                    className="premium-button-tonal w-full justify-center py-2 text-sm"
                  >
                    清除所有筛选条件
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

