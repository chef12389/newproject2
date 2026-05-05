import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Heart, MapPin, Puzzle, Search, SortAsc, Sparkles, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import { categoryData, galleryItems, type FactMetric } from '@/data/architectureData'
import { useSectionReveal } from '@/lib/cinematic'
import { cardHoverQuick, cardPressQuick, fastCardRevealVariants, pageSectionVariants, viewportCardRevealVariants } from '@/lib/motion'
import { getJourneyState, trackCase, trackPageVisit, toggleFavoriteCase } from '@/lib/progress'

type FilterId = 'all' | (typeof categoryData)[number]['id']
type SortKey = 'chronology' | 'name'

function parseChronologyValue(item: { year: string }) {
  const numericMatch = item.year.match(/-?\d+/)
  if (!numericMatch) {
    return Number.MAX_SAFE_INTEGER
  }

  const raw = parseInt(numericMatch[0], 10)
  return Number.isNaN(raw) ? Number.MAX_SAFE_INTEGER : raw
}

export default function Gallery() {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('chronology')
  const [selectedId, setSelectedId] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const galleryCaseIdSet = useMemo(() => new Set(galleryItems.map((item) => item.id)), [])

  const getValidFavorites = () => getJourneyState().favoriteCases.filter((id) => galleryCaseIdSet.has(id))

  useEffect(() => {
    trackPageVisit('/gallery')
    setFavorites(getValidFavorites())
  }, [galleryCaseIdSet])

  const searchedItems = useMemo(() => {
    const lower = query.trim().toLowerCase()
    if (!lower) {
      return galleryItems
    }

    return galleryItems.filter((item) => {
      const searchable = `${item.name} ${item.location} ${item.dynasty} ${item.year} ${item.categoryName ?? ''} ${item.summary} ${(item.concepts ?? []).join(' ')}`.toLowerCase()
      return searchable.includes(lower)
    })
  }, [query])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    searchedItems.forEach((item) => {
      counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + 1)
    })
    return counts
  }, [searchedItems])

  useEffect(() => {
    if (filter === 'all') {
      return
    }

    if ((categoryCounts.get(filter) ?? 0) === 0) {
      setFilter('all')
    }
  }, [categoryCounts, filter])

  const filteredItems = useMemo(() => {
    let list = filter === 'all' ? searchedItems : searchedItems.filter((item) => item.categoryId === filter)

    if (sortKey === 'chronology') {
      list = [...list].sort((a, b) => parseChronologyValue(a) - parseChronologyValue(b))
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans'))
    }

    return list
  }, [filter, searchedItems, sortKey])

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0],
    [filteredItems, selectedId],
  )

  const gridItems = useMemo(() => filteredItems, [filteredItems])

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedId('')
      return
    }

    if (!filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id)
    }
  }, [filteredItems, selectedId])

  const handleFavorite = (caseId: string) => {
    if (!galleryCaseIdSet.has(caseId)) {
      return
    }
    toggleFavoriteCase(caseId)
    setFavorites(getValidFavorites())
  }

  useSectionReveal(pageRef)

  const changeSelectedItem = (caseId: string) => {
    setSelectedId(caseId)
    trackCase(caseId)
  }

  const moveSelection = (direction: 'prev' | 'next') => {
    if (!selectedItem || filteredItems.length <= 1) {
      return
    }

    const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id)
    const nextIndex = direction === 'next' ? (currentIndex + 1) % filteredItems.length : (currentIndex - 1 + filteredItems.length) % filteredItems.length

    const nextItem = filteredItems[nextIndex]
    if (nextItem) {
      changeSelectedItem(nextItem.id)
    }
  }

  return (
    <div ref={pageRef} className="page-shell">
      <GlobalNav />

      <motion.section
        ref={heroRef}
        className="page-header gallery-hero-v2"
        initial="initial"
        animate="animate"
        variants={pageSectionVariants}
        data-cine-spotlight-image
      >
        <div className="gallery-hero-v2-bg" data-cine-spotlight-image>
          <LazyImage src="/images/shouye5.jpg" alt="营造新途" className="gallery-hero-v2-image" priority />
          <div className="gallery-hero-v2-overlay" />
          <div className="gallery-hero-v2-grain" />
        </div>

        <div className="gallery-hero-v2-content">
          <div className="gallery-hero-v2-layout">
            <motion.div className="gallery-hero-v2-copy" data-cine-copy initial="initial" animate="animate" variants={pageSectionVariants}>
              <motion.div className="gallery-hero-v2-badge">
                <span className="gallery-hero-v2-badge-dot" />
                建筑图鉴
              </motion.div>

              <h1 className="gallery-hero-v2-title">
                <span className="gallery-hero-v2-title-line">取千载古意</span>
                <span className="gallery-hero-v2-title-line">
                  <span className="gallery-hero-v2-title-accent">入创意设计</span>
                </span>
              </h1>

              <p className="gallery-hero-v2-subtitle">
                从宫殿庙宇到园林民居，按朝代、地域与类型自由浏览，
                在古建图像中寻找文创设计的视觉灵感。
              </p>

              <motion.div className="gallery-hero-v2-stats" data-cine-actions variants={pageSectionVariants}>
                <div className="gallery-hero-v2-stat">
                  <Eye className="h-4 w-4" />
                  <span className="gallery-hero-v2-stat-value">{galleryItems.length}</span>
                  <span className="gallery-hero-v2-stat-label">设计案例</span>
                </div>
                <div className="gallery-hero-v2-stat">
                  <MapPin className="h-4 w-4" />
                  <span className="gallery-hero-v2-stat-value">{categoryData.length}</span>
                  <span className="gallery-hero-v2-stat-label">素材门类</span>
                </div>
              </motion.div>

              <motion.div className="gallery-hero-v2-actions" data-cine-actions variants={pageSectionVariants}>
                <button
                  onClick={() => {
                    const filterSection = document.querySelector('[data-cine-section]')
                    filterSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="gallery-hero-v2-cta-primary"
                >
                  <span className="gallery-hero-v2-cta-primary-text">开始浏览</span>
                </button>
                <button onClick={() => navigate('/puzzle')} className="gallery-hero-v2-cta-glass">
                  拼图练习
                  <Puzzle className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="gallery-hero-v2-scroll" data-cine-scroll>
          <HeroScrollCue tone="paper" label="向下展开卷轴" />
        </div>
      </motion.section>

      <div className="gallery-hero-transition" aria-hidden="true">
        <svg className="gallery-hero-transition-ornament" viewBox="0 0 1200 48" preserveAspectRatio="none">
          <path d="M0 24 Q150 8, 300 24 T600 24 T900 24 T1200 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <path d="M0 24 Q150 40, 300 24 T600 24 T900 24 T1200 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      <main id="main-content" className="page-main pt-4 sm:pt-8">
        <motion.section className="mb-6 surface-card interactive-surface rounded-[24px] p-4 md:p-5" initial="initial" animate="animate" variants={fastCardRevealVariants} data-cine-section>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'all' ? 'premium-button-primary' : 'premium-button-glass'}`}
              >
                <span>全部</span>
              </button>
              {categoryData.map((item) => {
                const count = categoryCounts.get(item.id) ?? 0
                const isActive = filter === item.id
                const isDisabled = count === 0

                return (
                  <button
                    key={item.id}
                    disabled={isDisabled}
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'text-white' : 'premium-button-glass'} ${isDisabled ? 'cursor-not-allowed opacity-45' : ''}`}
                    style={isActive ? { backgroundColor: item.accent } : undefined}
                  >
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-h-[48px] items-center gap-2 rounded-[20px] border border-white/40 bg-white/75 px-3 py-2 dark:border-white/10 dark:bg-white/8">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索名称 / 朝代 / 地点"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-56"
                />
              </label>

              <label className="flex min-h-[48px] items-center gap-2 rounded-[20px] border border-white/40 bg-white/75 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/8">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="chronology">按年份</option>
                  <option value="name">按名称</option>
                </select>
              </label>
            </div>
          </div>
        </motion.section>

        {!selectedItem ? (
          <motion.section className="glass-panel p-8 text-center" initial="initial" animate="animate" variants={fastCardRevealVariants} data-cine-section>
            <h2 className="text-2xl font-black text-foreground">暂无可展示案例</h2>
            <p className="mt-3 text-sm text-muted-foreground">请调整筛选或搜索条件后重试。</p>
          </motion.section>
        ) : (
          <>
            <motion.section className="mb-8" initial="initial" animate="animate" variants={fastCardRevealVariants} data-cine-section>
              <div className="glass-panel interactive-surface overflow-hidden rounded-[24px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-8">
                    <motion.div
                      key={selectedItem.id}
                      initial={{ opacity: 0.4, scale: 0.976, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => moveSelection('next')}
                      className="group relative cursor-pointer overflow-hidden bg-white/18"
                      data-cine-media
                    >
                      <LazyImage
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="h-[300px] w-full md:h-[400px] lg:h-[480px]"
                        imgClassName="object-cover object-center"
                        width={1600}
                        height={1200}
                        quality={95}
                        showLoadedOverlay={false}
                        priority
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                      {filteredItems.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              moveSelection('prev')
                            }}
                            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-white/88 p-2.5 text-foreground shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white sm:left-3 sm:p-3"
                            aria-label="上一张"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              moveSelection('next')
                            }}
                            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-white/88 p-2.5 text-foreground shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white sm:right-3 sm:p-3"
                            aria-label="下一张"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                          <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-[16px] bg-black/28 px-3 py-1.5 text-center text-[11px] font-medium text-white/92 backdrop-blur-sm sm:bottom-4 sm:left-auto sm:right-4 sm:w-auto sm:rounded-full sm:text-xs">
                            点击图片切换下一张
                          </div>
                        </>
                      )}
                    </motion.div>

                    <div className="p-4 md:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip">{selectedItem.categoryName}</span>
                        <span className="chip">
                          <MapPin className="mr-1 h-3 w-3" />
                          {selectedItem.location}
                        </span>
                        <span className="chip">{selectedItem.dynasty}</span>
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-2xl md:text-3xl font-black text-foreground">{selectedItem.name}</h2>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{selectedItem.summary}</p>
                        </div>
                        <motion.button
                          onClick={() => handleFavorite(selectedItem.id)}
                          className={`rounded-2xl p-3 ${favorites.includes(selectedItem.id) ? 'bg-cinnabar text-white' : 'bg-white/80 text-foreground dark:bg-white/10'}`}
                          aria-label="收藏案例"
                          whileHover={cardHoverQuick}
                          whileTap={cardPressQuick}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(selectedItem.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {(selectedItem.facts ?? []).slice(0, 3).map((fact: FactMetric, index: number) => (
                          <motion.div
                            key={fact.label}
                            className="rounded-[16px] border border-white/40 bg-white/72 p-3 dark:border-white/10 dark:bg-white/7"
                            variants={viewportCardRevealVariants}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={cardHoverQuick}
                            whileTap={cardPressQuick}
                          >
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{fact.label}</div>
                            <div className="mt-2 text-lg font-black text-foreground">{fact.value}</div>
                            <p className="mt-1 text-xs leading-6 text-muted-foreground">{fact.detail}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
                        <motion.div
                          className="rounded-[16px] border border-white/40 bg-white/72 p-4 dark:border-white/10 dark:bg-white/7"
                          variants={viewportCardRevealVariants}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true, amount: 0.2 }}
                          whileHover={cardHoverQuick}
                          whileTap={cardPressQuick}
                        >
                          <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                            <Sparkles className="h-4 w-4 text-primary" />
                            观看提示
                          </div>
                          <p className="text-sm leading-6 text-muted-foreground">
                            先判断整体轮廓、轴线和体量关系，再看门窗、砖木、石雕等局部细节，会更容易辨认它所属的类型和地域传统。
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(selectedItem.concepts ?? []).slice(0, 4).map((concept: string) => (
                              <span key={concept} className="chip">
                                {concept}
                              </span>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          className="rounded-[16px] border border-white/40 bg-white/72 p-4 dark:border-white/10 dark:bg-white/7"
                          variants={viewportCardRevealVariants}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ delay: 0.05 }}
                          whileHover={cardHoverQuick}
                          whileTap={cardPressQuick}
                        >
                          <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                            <BookOpen className="h-4 w-4 text-primary" />
                            延伸入口
                          </div>
                          <p className="text-sm leading-6 text-muted-foreground">
                            想继续往下看，可以转到对应素材档案，把视觉观察和结构信息整合起来。
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <motion.button
                              onClick={() => navigate(`/architecture/${selectedItem.categoryId}`)}
                              className="premium-button-primary inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                              whileHover={cardHoverQuick}
                              whileTap={cardPressQuick}
                            >
                              查看类型档案
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 bg-white/5 dark:bg-white/5">
                    <div className="h-full p-4 md:p-5">
                      <div className="mb-3 flex items-center justify-between text-sm font-bold text-muted-foreground">
                        <span>案例列表</span>
                        <button onClick={() => navigate('/puzzle')} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          <Puzzle className="h-3.5 w-3.5" />
                          拼图练习
                        </button>
                      </div>
                      <div className="max-h-[600px] space-y-2 overflow-auto pr-1">
                        {filteredItems.map((item) => (
                          <motion.button
                            key={item.id}
                            whileHover={cardHoverQuick}
                            whileTap={cardPressQuick}
                            onClick={() => {
                              changeSelectedItem(item.id)
                            }}
                            className={`w-full rounded-2xl p-3 text-left ${selectedItem.id === item.id ? 'text-white shadow-card' : 'bg-white/75 text-foreground dark:bg-white/6'}`}
                            style={selectedItem.id === item.id ? { backgroundColor: item.accent } : undefined}
                          >
                            <div className="text-sm font-black">{item.name}</div>
                            <div className={`mt-1 text-xs ${selectedItem.id === item.id ? 'text-white/85' : 'text-muted-foreground'}`}>
                              {item.dynasty} · {item.location}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gridItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  layout
                  variants={viewportCardRevealVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={cardHoverQuick}
                  whileTap={cardPressQuick}
                  onClick={() => {
                    changeSelectedItem(item.id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="surface-card-strong interactive-surface group overflow-hidden rounded-[16px] p-0 text-left transition-all duration-300 shadow-card hover:shadow-elegant"
                  data-cine-card
                >
                  <div className="relative">
                    <LazyImage
                      src={item.image}
                      alt={item.name}
                      className="h-[200px] w-full"
                      imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                      <span className="chip bg-white/90 text-xs">{item.categoryName}</span>
                      {favorites.includes(item.id) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          className="chip bg-white/90 text-xs text-cinnabar"
                        >
                          <Heart className="mr-1 h-3 w-3 fill-current" />
                          已藏
                        </motion.span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="font-serif text-base font-black text-white">{item.name}</div>
                      <div className="mt-1 text-xs text-white/80">
                        {item.dynasty} · {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary">{item.facts?.[0]?.label || '看点'}</div>
                    <div className="text-sm font-black text-foreground">{item.facts?.[0]?.value || '空间亮点'}</div>
                  </div>
                </motion.button>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
