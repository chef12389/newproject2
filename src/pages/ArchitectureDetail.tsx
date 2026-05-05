import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpDown,
  BookOpen,
  Download,
  ExternalLink,
  Heart,
  Image,
  MapPin,
  MoveRight,
  Share2,
  Sparkles,
  TimerReset,
} from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CategoryNav from '@/components/CategoryNav'
import FavoriteCollectionModal from '@/components/FavoriteCollectionModal'
import GlobalNav from '@/components/GlobalNav'
import { LazyImage } from '@/components/LazyImage'
import { SearchPanel, type SearchFilters } from '@/components/SearchPanel'
import { toastError, toastInfo, toastSuccess } from '@/components/ToastNotification'
import { type CaseStudy, categoryData, getCategoryById } from '@/data/architectureData'
import { isPrimaryCategory } from '@/data/architectureFocus'
import { downloadCaseImage, shareCaseLink } from '@/lib/caseActions'
import { useSectionReveal } from '@/lib/cinematic'
import { cardHoverQuick, cardPressQuick, fastCardRevealVariants, viewportCardRevealVariants } from '@/lib/motion'
import { getJourneyState, toggleFavoriteCase, trackCase, trackCategory, trackPageVisit } from '@/lib/progress'

type CaseSortKey = 'timeline-asc' | 'timeline-desc' | 'name' | 'location'

function parseYear(year: string) {
  const value = Number.parseInt(year.replace(/[^\d-]/g, ''), 10)
  return Number.isNaN(value) ? 0 : value
}

function uniqueBy<T>(items: T[], getter: (item: T) => string) {
  return Array.from(new Set(items.map(getter)))
}

function buildCaseSearchableText(item: CaseStudy) {
  return `${item.name} ${item.location} ${item.dynasty} ${item.summary} ${item.concepts.join(' ')}`
}

export default function ArchitectureDetail() {
  const navigate = useNavigate()
  const { type } = useParams()
  const pageRef = useRef<HTMLDivElement | null>(null)
  const [searchParams] = useSearchParams()
  const fallbackCategory = categoryData[0]
  const category = useMemo(() => getCategoryById(type) ?? fallbackCategory, [fallbackCategory, type])
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [caseFilters, setCaseFilters] = useState<SearchFilters>({ query: '' })
  const [sortKey, setSortKey] = useState<CaseSortKey>('timeline-asc')
  const [favoriteCaseIds, setFavoriteCaseIds] = useState<string[]>(() => getJourneyState().favoriteCases)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)

  useEffect(() => {
    trackPageVisit(`/architecture/${type ?? ''}`)
  }, [type])

  useEffect(() => {
    const syncJourney = () => {
      setFavoriteCaseIds(getJourneyState().favoriteCases)
    }

    syncJourney()
    window.addEventListener('journey-updated', syncJourney)
    return () => window.removeEventListener('journey-updated', syncJourney)
  }, [])

  useEffect(() => {
    if (!category) {
      return
    }

    trackCategory(category.id)
    const requestedCaseId = searchParams.get('case')
    const matchedCaseId = category.cases.find((item) => item.id === requestedCaseId)?.id
    setSelectedCaseId(matchedCaseId ?? category.cases[0]?.id ?? '')
    setCaseFilters({ query: '' })
    setSortKey('timeline-asc')
  }, [category, searchParams])

  useEffect(() => {
    if (type && !getCategoryById(type) && fallbackCategory) {
      navigate(`/architecture/${fallbackCategory.id}`, { replace: true })
    }
  }, [fallbackCategory, navigate, type])

  const availableDynasties = useMemo(() => uniqueBy(category?.cases ?? [], (item) => item.dynasty), [category])
  const availableRegions = useMemo(() => uniqueBy(category?.cases ?? [], (item) => item.region), [category])

  const filteredCases = useMemo(() => {
    if (!category) {
      return []
    }

    const query = caseFilters.query.trim().toLowerCase()
    let cases = category.cases.filter((item) => {
      if (caseFilters.dynasty && item.dynasty !== caseFilters.dynasty) return false
      if (caseFilters.region && item.region !== caseFilters.region) return false
      if (caseFilters.hasRating && !item.heritageTags?.length && !item.featured) return false
      if (!query) return true

      return buildCaseSearchableText(item).toLowerCase().includes(query)
    })

    switch (sortKey) {
      case 'timeline-desc':
        cases = [...cases].sort((a, b) => parseYear(b.year) - parseYear(a.year))
        break
      case 'name':
        cases = [...cases].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans'))
        break
      case 'location':
        cases = [...cases].sort((a, b) => a.location.localeCompare(b.location, 'zh-Hans'))
        break
      default:
        cases = [...cases].sort((a, b) => parseYear(a.year) - parseYear(b.year))
    }

    return cases
  }, [caseFilters, category, sortKey])

  useEffect(() => {
    if (!filteredCases.length) {
      setSelectedCaseId('')
      return
    }

    if (!filteredCases.some((item) => item.id === selectedCaseId)) {
      setSelectedCaseId(filteredCases[0].id)
    }
  }, [filteredCases, selectedCaseId])

  const selectedCase = useMemo(() => {
    if (!filteredCases.length) {
      return undefined
    }

    return filteredCases.find((item) => item.id === selectedCaseId) ?? filteredCases[0]
  }, [filteredCases, selectedCaseId])

  useEffect(() => {
    if (!selectedCase?.id) {
      return
    }
    trackCase(selectedCase.id)
  }, [selectedCase?.id])

  useSectionReveal(pageRef)

  const selectedCaseIsFavorite = selectedCase ? favoriteCaseIds.includes(selectedCase.id) : false

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
    trackCase(caseId)
  }

  const handleToggleFavorite = () => {
    if (!selectedCase) {
      return
    }

    const wasFavorite = favoriteCaseIds.includes(selectedCase.id)
    toggleFavoriteCase(selectedCase.id)

    if (wasFavorite) {
      toastInfo('已移出收藏', '这个案例已从收藏夹中移除。')
    } else {
      toastSuccess('已加入收藏', '现在可以在收藏弹窗、图像展廊和用户中心继续查看。')
    }
  }

  const handleShareCase = async () => {
    if (!selectedCase) {
      return
    }

    try {
      const result = await shareCaseLink({
        title: selectedCase.name,
        text: `${category.name} · ${selectedCase.location}`,
        categoryId: category.id,
        caseId: selectedCase.id,
      })

      if (result === 'shared') {
        toastSuccess('已调起分享', '把这个案例发给更多人看看。')
      } else if (result === 'copied') {
        toastSuccess('链接已复制', '现在可以直接粘贴分享。')
      } else {
        toastInfo('当前环境不支持系统分享', '你可以手动复制页面地址。')
      }
    } catch {
      toastError('分享失败', '请稍后再试。')
    }
  }

  const handleDownloadCase = async () => {
    if (!selectedCase) {
      return
    }

    const ok = await downloadCaseImage({
      image: selectedCase.image,
      filename: `${category.name}-${selectedCase.name}.jpg`,
    })

    if (ok) {
      toastSuccess('图片开始下载', '已按原图地址保存当前案例图片。')
    } else {
      toastError('下载失败', '请稍后再试。')
    }
  }

  if (!category) {
    return null
  }

  return (
    <div ref={pageRef} className="page-shell">
      <GlobalNav />

      <section className="page-header" data-cine-section>
        <div className="page-header-inner">
          <div className="liquid-panel overflow-hidden" data-cine-step>
            <div className="h-1.5 w-full" style={{ background: category.accent }} />
            <div className="px-5 py-4 md:px-8 md:py-5 xl:px-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <motion.button type="button" onClick={() => navigate('/achievement')} className="premium-button-glass inline-flex items-center gap-2" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                      <ArrowLeft className="h-4 w-4" />
                      返回设计素材
                    </motion.button>
                    <span className="chip">{isPrimaryCategory(category.id) ? '重点营造类型' : '延展营造类型'}</span>
                    <span className="chip">{category.sampleCount} 个案例</span>
                    <span className="chip">{category.regionCount} 个地区</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
                    <h1 className="text-2xl font-black text-foreground md:text-3xl">{category.name}</h1>
                    <p className="text-sm font-semibold md:text-base" style={{ color: category.accent }}>
                      {category.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button type="button" onClick={() => navigate('/gallery')} className="premium-button-glass inline-flex items-center gap-2" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                    图像展廊
                    <Image className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsFavoritesOpen(true)}
                    className="premium-button-glass inline-flex items-center gap-2"
                    whileHover={cardHoverQuick}
                    whileTap={cardPressQuick}
                  >
                    查看收藏
                    <Heart className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <CategoryNav grouped className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <main className="page-main pt-4 sm:pt-6">
        <section className="space-y-6">
          <div className="glass-panel p-5 md:p-6" data-cine-section>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 max-w-2xl">
                <div className="chip mb-3">案例筛选</div>
                <h2 className="text-2xl font-black text-foreground">直接进入筛选</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px]">
                <div className="rounded-[20px] border border-white/35 bg-white/72 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-muted-foreground">当前结果</div>
                  <div className="mt-2 text-2xl font-black text-foreground">{filteredCases.length}</div>
                </div>
                <div className="rounded-[20px] border border-white/35 bg-white/72 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-muted-foreground">重点案例</div>
                  <div className="mt-2 text-2xl font-black text-foreground">{category.cases.filter((item) => item.featured).length}</div>
                </div>
                <div className="rounded-[20px] border border-white/35 bg-white/72 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-muted-foreground">已收藏</div>
                  <div className="mt-2 text-2xl font-black text-foreground">{favoriteCaseIds.length}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-start">
              <SearchPanel
                filters={caseFilters}
                onChange={setCaseFilters}
                availableDynasties={availableDynasties}
                availableRegions={availableRegions}
                totalResults={filteredCases.length}
                searchPlaceholder="搜索名称、朝代、地点或结构关键词"
                booleanFilterTitle="重点案例"
                booleanFilterOnText="仅看重点"
                booleanFilterOffText="显示全部"
              />

              <div className="rounded-[24px] border border-white/35 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ArrowUpDown className="h-4 w-4" />
                  排序方式
                </div>
                <select
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as CaseSortKey)}
                  className="w-full rounded-2xl border border-white/35 bg-white/85 px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/35 dark:border-white/10 dark:bg-white/10"
                >
                  <option value="timeline-asc">按时间从早到晚</option>
                  <option value="timeline-desc">按时间从晚到早</option>
                  <option value="name">按名称</option>
                  <option value="location">按地点</option>
                </select>
              </div>
            </div>
          </div>

          {selectedCase ? (
            <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <motion.div className="order-2 glass-panel p-4 md:p-5 xl:order-1" variants={fastCardRevealVariants} initial="initial" animate="animate">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="chip mb-2">案例切换</div>
                    <div className="text-xl font-black text-foreground">缩略列表</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{filteredCases.length} 项</div>
                </div>

                <div className="grid gap-3 md:max-h-[720px] md:overflow-y-auto md:pr-1">
                  {filteredCases.length > 0 ? (
                    filteredCases.map((item) => {
                      const isActive = selectedCase.id === item.id

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCase(item.id)}
                          className={`group overflow-hidden rounded-[24px] border text-left transition-all duration-300 ${
                            isActive
                              ? 'border-transparent text-white shadow-card'
                              : 'border-white/35 bg-white/72 text-foreground hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/90 dark:border-white/10 dark:bg-white/5'
                          }`}
                          style={isActive ? { background: `linear-gradient(135deg, ${category.accent}, rgba(17, 24, 39, 0.92))` } : undefined}
                          whileHover={cardHoverQuick}
                          whileTap={cardPressQuick}
                        >
                          <div className="grid grid-cols-[92px_minmax(0,1fr)] items-stretch">
                            <LazyImage src={item.image} alt={item.name} className="h-full min-h-[104px] w-full" imgClassName="object-cover" />
                            <div className="p-4">
                              <div className="line-clamp-1 text-base font-black">{item.name}</div>
                              <div className={`mt-1 text-sm ${isActive ? 'text-white/78' : 'text-muted-foreground'}`}>
                                {item.dynasty} · {item.location}
                              </div>
                              <div className={`mt-2 line-clamp-2 text-xs leading-6 ${isActive ? 'text-white/78' : 'text-muted-foreground'}`}>
                                {item.summary}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/35 bg-white/65 p-5 text-sm leading-7 text-muted-foreground dark:border-white/10 dark:bg-white/5">
                      当前筛选没有找到可浏览的案例。可以清空筛选，或换一个朝代与地区继续看。
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div className="order-1 glass-panel overflow-hidden p-4 md:p-6 xl:order-2" variants={fastCardRevealVariants} initial="initial" animate="animate">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="chip mb-3">代表案例</div>
                    <h2 className="text-2xl font-black text-foreground md:text-3xl">{selectedCase.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">
                        <MapPin className="mr-1 h-3 w-3" />
                        {selectedCase.location}
                      </span>
                      <span className="chip">
                        <TimerReset className="mr-1 h-3 w-3" />
                        {selectedCase.year}
                      </span>
                      <span className="chip">{selectedCase.dynasty}</span>
                      {selectedCase.heritageTags?.slice(0, 1).map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <motion.button
                      type="button"
                      onClick={handleToggleFavorite}
                      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                        selectedCaseIsFavorite ? 'bg-cinnabar text-white shadow-cinnabar' : 'premium-button-glass'
                      }`}
                      whileHover={cardHoverQuick}
                      whileTap={cardPressQuick}
                    >
                      <Heart className={`h-4 w-4 ${selectedCaseIsFavorite ? 'fill-current' : ''}`} />
                      {selectedCaseIsFavorite ? '已收藏' : '收藏案例'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsFavoritesOpen(true)}
                      className="premium-button-glass inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
                      whileHover={cardHoverQuick}
                      whileTap={cardPressQuick}
                    >
                      收藏弹窗
                      <Image className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCase.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.24 }}
                    className="space-y-5"
                  >
                    <LazyImage
                      src={selectedCase.image}
                      alt={selectedCase.name}
                      className="h-[300px] w-full rounded-[24px] md:h-[420px] xl:h-[500px]"
                      imgClassName="object-cover"
                      priority
                    />

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                      <div className="rounded-[24px] border border-white/35 bg-white/72 p-5 dark:border-white/10 dark:bg-white/5">
                        <div className="text-sm leading-7 text-muted-foreground">{selectedCase.summary}</div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {(selectedCase.innovations ?? []).map((item) => (
                            <div key={item} className="rounded-[20px] border border-white/25 bg-white/80 p-4 text-sm leading-6 text-foreground dark:border-white/10 dark:bg-white/5">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <motion.button type="button" onClick={handleShareCase} className="premium-button-glass inline-flex min-h-[52px] items-center justify-between rounded-[22px] px-4 py-4 text-sm font-semibold" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                          分享这个案例
                          <Share2 className="h-4 w-4" />
                        </motion.button>
                        <motion.button type="button" onClick={handleDownloadCase} className="premium-button-glass inline-flex min-h-[52px] items-center justify-between rounded-[22px] px-4 py-4 text-sm font-semibold" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                          下载原图
                          <Download className="h-4 w-4" />
                        </motion.button>
                        <motion.button type="button" onClick={() => navigate('/gallery')} className="premium-button-glass inline-flex min-h-[52px] items-center justify-between rounded-[22px] px-4 py-4 text-sm font-semibold" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                          继续看图像展廊
                          <MoveRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </section>
          ) : null}

          {selectedCase ? (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <motion.article className="glass-panel p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.14 }}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: category.accent }}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">证据与线索</div>
                    <div className="text-lg font-black text-foreground">{selectedCase.name}</div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {(selectedCase.facts ?? []).map((item, index) => (
                    <motion.div
                      key={`${item.label}-${index}`}
                      className="rounded-[24px] border border-white/30 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5"
                      variants={viewportCardRevealVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={cardHoverQuick}
                      whileTap={cardPressQuick}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="font-bold text-foreground">{item.label}</div>
                        <div className="text-sm font-semibold" style={{ color: category.accent }}>
                          {item.value}
                        </div>
                      </div>
                      <div className="text-sm leading-7 text-muted-foreground">{item.detail}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.div className="mt-5 rounded-[24px] border border-white/30 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                  <div className="mb-2 text-sm font-semibold" style={{ color: category.accent }}>
                    信息范围
                  </div>
                  <div className="text-sm leading-7 text-muted-foreground">{selectedCase.sourceScope}</div>
                </motion.div>
              </motion.article>

              <motion.article className="glass-panel p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.14 }}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: category.accent }}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">来源与标签</div>
                    <div className="text-lg font-black text-foreground">继续深看这个案例</div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {(selectedCase.sources ?? []).map((item, index) => (
                    <motion.a
                      key={`${item.url}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-4 rounded-[24px] border border-white/30 bg-white/72 p-4 transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                      variants={viewportCardRevealVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={cardHoverQuick}
                      whileTap={cardPressQuick}
                    >
                      <div>
                        <div className="font-bold text-foreground">{item.label}</div>
                        <div className="mt-1 text-sm" style={{ color: category.accent }}>
                          {item.publisher}
                        </div>
                      </div>
                      <ExternalLink className="mt-1 h-4 w-4 flex-none text-muted-foreground" />
                    </motion.a>
                  ))}
                </div>

                <motion.div className="mt-5 rounded-[24px] border border-white/30 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                  <div className="mb-3 text-sm font-semibold" style={{ color: category.accent }}>
                    关键词
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCase.concepts ?? []).map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.article>
            </section>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <motion.article className="glass-panel p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.14 }}>
              <div className="mb-5">
                <div className="chip mb-2">结构阅读</div>
                <h2 className="text-2xl font-black text-foreground">{category.name} 的核心骨架</h2>
              </div>

              <div className="grid gap-3">
                {(category.structure ?? []).map((item, index) => (
                  <motion.div
                    key={`${item.name}-${index}`}
                    className="rounded-[24px] border border-white/30 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5"
                    variants={viewportCardRevealVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={cardHoverQuick}
                    whileTap={cardPressQuick}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="font-bold text-foreground">{item.name}</div>
                      <div className="flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-xs font-black text-white" style={{ backgroundColor: category.accent }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="text-sm leading-7 text-muted-foreground">{item.summary}</div>
                    <div className="mt-3 text-sm font-semibold" style={{ color: category.accent }}>
                      {item.role}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-5 rounded-[24px] border border-white/30 bg-white/72 p-5 dark:border-white/10 dark:bg-white/5" whileHover={cardHoverQuick} whileTap={cardPressQuick}>
                <div className="mb-3 text-sm font-semibold" style={{ color: category.accent }}>
                  为什么这一类型会持续存在
                </div>
                <div className="grid gap-3">
                  {(category.drivers ?? []).map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[18px] bg-white/80 px-4 py-3 dark:bg-white/5">
                      <div className="h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: category.accent }} />
                      <div className="text-sm font-medium text-foreground">{item}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.article>

            <motion.article className="glass-panel p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.14 }}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="chip mb-2">类型演化</div>
                  <h2 className="text-2xl font-black text-foreground">从早期形态到成熟样式</h2>
                </div>
                <div className="hidden text-sm text-muted-foreground md:block">{category.span}</div>
              </div>

              <div className="grid gap-3">
                {(category.evolution ?? []).map((item, index) => (
                  <motion.div
                    key={`${item.era}-${index}`}
                    variants={viewportCardRevealVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={cardHoverQuick}
                    whileTap={cardPressQuick}
                    className="rounded-[24px] border border-white/30 bg-white/72 p-5 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-sm font-semibold" style={{ color: category.accent }}>
                      {item.era}
                    </div>
                    <div className="mt-2 text-xl font-black text-foreground">{item.focus}</div>
                    <div className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.article>
          </section>
        </section>
      </main>

      <FavoriteCollectionModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} favoriteCaseIds={favoriteCaseIds} />
    </div>
  )
}
