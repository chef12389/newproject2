import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LayoutGrid, Menu, Moon, Sun, User, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CommentPlaqueIcon,
  CultureWindowIcon,
  GalleryImageIcon,
  HallOfAchievementIcon,
  HomePavilionIcon,
  ProfileSealIcon,
  ScientistPortraitIcon,
  TrainingPuzzleIcon,
  TreatiseScrollIcon,
  type SiteIcon,
} from '@/components/siteIcons'
import { useTheme } from '@/contexts/ThemeContext'
import { getCurrentUser, isAuthenticated, isGuestSession } from '@/lib/auth'
import { useNavReveal } from '@/lib/cinematic'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  subLabel: string
  hint: string
  path: string
  icon: SiteIcon
  accent: string
  soft: string
}

type FloatingNavItem = NavItem & {
  y: number
}

const coreNavItems: NavItem[] = [
  { label: '首页', subLabel: '总览', hint: '返回总览首页', path: '/', icon: HomePavilionIcon, accent: '#b56a1e', soft: 'rgba(232, 191, 121, 0.18)' },
  { label: '营造华章', subLabel: '建筑', hint: '建筑类型专题', path: '/achievement', icon: HallOfAchievementIcon, accent: '#a34827', soft: 'rgba(204, 111, 82, 0.16)' },
  { label: '创意大师', subLabel: '人物', hint: '文创人物与设计谱系', path: '/scientists', icon: ScientistPortraitIcon, accent: '#446a94', soft: 'rgba(111, 156, 210, 0.16)' },
  { label: '设计典籍', subLabel: '文献', hint: '文创典籍与设计知识', path: '/treatises', icon: TreatiseScrollIcon, accent: '#667f34', soft: 'rgba(145, 176, 93, 0.18)' },
  { label: '文化创意', subLabel: '文创', hint: '文化创意与生活方式', path: '/culture', icon: CultureWindowIcon, accent: '#2d7569', soft: 'rgba(91, 179, 161, 0.17)' },
  { label: '灵感图库', subLabel: '图库', hint: '设计灵感图像库', path: '/gallery', icon: GalleryImageIcon, accent: '#bc7b24', soft: 'rgba(224, 186, 96, 0.16)' },
  { label: '创意训练', subLabel: '训练', hint: '文创设计训练中心', path: '/training-center', icon: TrainingPuzzleIcon, accent: '#7a4bb6', soft: 'rgba(153, 121, 207, 0.18)' },
]

const userMenuItems: NavItem[] = [
  { label: '个人中心', subLabel: '档案', hint: '查看学习档案与收藏', path: '/user', icon: ProfileSealIcon, accent: '#2f6c62', soft: 'rgba(91, 168, 154, 0.17)' },
  { label: '评论交流', subLabel: '互动', hint: '查看互动评论与讨论', path: '/comments', icon: CommentPlaqueIcon, accent: '#8e5f9e', soft: 'rgba(164, 126, 185, 0.18)' },
]

const floatingNavItems: FloatingNavItem[] = [
  { ...coreNavItems[0], y: -60 },
  { ...coreNavItems[1], y: -115 },
  { ...coreNavItems[2], y: -170 },
  { ...coreNavItems[5], y: -225 },
  { ...coreNavItems[6], y: -280 },
]

function MenuBadge({
  item,
  active,
  compact = false,
}: {
  item: NavItem
  active: boolean
  compact?: boolean
}) {
  const Icon = item.icon

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border transition-all duration-300',
        compact ? 'h-[26px] w-[26px]' : 'h-8 w-8',
        active ? 'border-white/18 bg-white/12 text-white' : 'border-white/50 dark:border-white/10',
      )}
      style={
        active
          ? undefined
          : {
              background: `linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,255,255,0.74) 42%, ${item.soft})`,
              color: item.accent,
              boxShadow: `0 10px 18px -16px ${item.accent}55, inset 0 1px 0 rgba(255,255,255,0.78)`,
            }
      }
    >
      <span className="absolute inset-[1px] rounded-full border border-white/34 opacity-55 dark:border-white/8" />
      <span className="absolute inset-[4px] rounded-full bg-white/25 opacity-38 blur-[1px] dark:bg-white/5" />
      <Icon className={cn('relative z-10 transition-transform duration-300 group-hover:scale-[1.06]', compact ? 'h-[17px] w-[17px]' : 'h-[22px] w-[22px]')} />
    </span>
  )
}

function NavChip({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={`${item.label} · ${item.hint}`}
      aria-label={`${item.label}，${item.hint}`}
      onClick={onClick}
      className={cn('nav-chip-button group', active && 'nav-chip-active')}
      style={{
        ['--nav-accent' as string]: item.accent,
        ['--nav-soft' as string]: item.soft,
      }}
    >
      <MenuBadge item={item} active={active} compact />
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className="truncate text-[12px] font-semibold tracking-[-0.01em]">{item.label}</span>
        <span className={cn('mt-1 text-[10px] font-medium tracking-[0.14em]', active ? 'text-white/72' : 'text-[#7d6853] dark:text-white/55')}>
          {item.subLabel}
        </span>
      </span>
    </button>
  )
}

function MobileEntry({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-[56px] items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition-all duration-300',
        active
          ? 'border-transparent text-white shadow-card'
          : 'border-white/35 bg-white/70 text-foreground dark:border-white/10 dark:bg-white/5',
      )}
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${item.accent}, rgba(22, 28, 38, 0.94))`,
              boxShadow: `0 18px 42px -28px ${item.accent}cc`,
            }
          : undefined
      }
    >
      <MenuBadge item={item} active={active} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">{item.label}</div>
          <div className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em]', active ? 'bg-white/14 text-white/78' : 'bg-black/[0.04] text-[#7d6853] dark:bg-white/8 dark:text-white/58')}>
            {item.subLabel}
          </div>
        </div>
        <div className={cn('mt-1 text-xs', active ? 'text-white/72' : 'text-muted-foreground')}>{item.hint}</div>
      </div>
    </button>
  )
}

function FloatingAction({
  item,
  active,
  open,
  index,
  onClick,
}: {
  item: FloatingNavItem
  active: boolean
  open: boolean
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      aria-label={item.label}
      title={`${item.label} · ${item.hint}`}
      initial={false}
      animate={
        open
          ? {
              opacity: 1,
              scale: active ? 1.05 : 1,
              x: 0,
              y: item.y,
              pointerEvents: 'auto',
            }
          : {
              opacity: 0,
              scale: 0.36,
              x: 0,
              y: 0,
              pointerEvents: 'none',
            }
      }
      transition={{
        duration: 0.25,
        delay: open ? index * 0.02 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      className={cn(
        'absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] border transition-all focus:outline-none',
        active ? 'border-white/35 text-white' : 'border-white/48 text-foreground dark:border-white/12',
      )}
      style={
        active
          ? {
              background: `linear-gradient(145deg, ${item.accent}, rgba(28, 35, 47, 0.96))`,
              boxShadow: `0 14px 26px -16px ${item.accent}bb`,
            }
          : {
              background: `linear-gradient(145deg, rgba(255,255,255,0.96), ${item.soft})`,
              boxShadow: `0 12px 22px -16px ${item.accent}55, inset 0 1px 0 rgba(255,255,255,0.9)`,
            }
      }
    >
      <span className="absolute inset-[1px] rounded-[14px] border border-white/50 opacity-80 dark:border-white/8" />
      <MenuBadge item={item} active={active} />
    </motion.button>
  )
}

export default function GlobalNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const navRootRef = useRef<HTMLDivElement | null>(null)
  const floatingRef = useRef<HTMLDivElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authState, setAuthState] = useState<'none' | 'guest' | 'user'>('none')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const sync = () => {
      if (isAuthenticated()) {
        setAuthState('user')
        setUserName(getCurrentUser()?.name ?? '')
        return
      }

      if (isGuestSession()) {
        setAuthState('guest')
        setUserName('')
        return
      }

      setAuthState('none')
      setUserName('')
    }

    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('auth-updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth-updated', sync)
    }
  }, [])

  useNavReveal(navRootRef)

  useEffect(() => {
    setMobileOpen(false)
    setSidebarOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!floatingRef.current?.contains(target)) {
        setSidebarOpen(false)
      }
      if (!userMenuRef.current?.contains(target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', mobileOpen)
    return () => document.body.classList.remove('mobile-nav-open')
  }, [mobileOpen])

  const userLabel = useMemo(() => {
    if (authState === 'user') return userName || '个人中心'
    if (authState === 'guest') return '访客档案'
    return '登录入口'
  }, [authState, userName])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const shellStyle = isDark
    ? {
        background: 'linear-gradient(180deg, rgba(18,22,31,0.92), rgba(14,18,27,0.94))',
        boxShadow: '0 18px 44px -24px rgba(0,0,0,0.56), inset 0 1px 0 rgba(255,244,222,0.05)',
      }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86))',
        boxShadow: '0 14px 32px -20px rgba(31,47,67,0.18), inset 0 1px 0 rgba(255,255,255,0.72)',
      }

  const userMenuActive = userMenuItems.some((item) => isActive(item.path))

  return (
    <div ref={navRootRef}>
      <button
        type="button"
        onClick={toggleTheme}
        data-nav-action
        className="premium-icon-button fixed left-3 top-3 z-[52] hidden h-11 w-11 xl:inline-flex"
        aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      >
        <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
          {isDark ? <Sun className="h-5 w-5 text-imperial-yellow" /> : <Moon className="h-5 w-5 text-primary" />}
        </motion.div>
      </button>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <div
          data-nav-shell
          className="glass-nav mx-auto flex max-w-[1150px] items-center gap-2 rounded-[22px] px-3 py-2.5 shadow-soft-lift sm:px-3.5 md:rounded-[28px] md:px-4"
          style={shellStyle}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex min-w-0 items-center gap-2.5 text-left xl:flex-none"
            data-nav-logo
            title="营造新途"
          >
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-cinnabar via-imperial-yellow to-amber-500 text-white shadow-gold">
              <LayoutGrid className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="truncate font-serif text-[14px] font-black text-foreground sm:text-[15px] xl:text-[16px]">营造新途</div>
            </div>
          </button>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 xl:flex">
            {coreNavItems.map((item) => (
              <div key={item.path} data-nav-chip className="flex-shrink-0">
                <NavChip item={item} active={isActive(item.path)} onClick={() => navigate(item.path)} />
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              data-nav-action
              className="premium-icon-button h-10 w-10 sm:h-11 sm:w-11 xl:hidden"
              aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
            >
              <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                {isDark ? <Sun className="h-4 w-4 text-imperial-yellow sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />}
              </motion.div>
            </button>

            <div ref={userMenuRef} className="relative hidden xl:block" data-nav-action>
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                aria-label="更多"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className={cn('nav-chip-button nav-user-button', (userMenuActive || userMenuOpen) && 'nav-chip-active')}
                style={{ ['--nav-accent' as string]: '#2f6c62', ['--nav-soft' as string]: 'rgba(91, 168, 154, 0.17)' }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cinnabar/80 via-imperial-yellow/80 to-amber-500/80 text-white shadow-sm">
                  <Menu className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <span className="truncate">更多</span>
                <ChevronDown className={cn('ml-auto h-3.5 w-3.5 shrink-0 transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {userMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="nav-chip-panel absolute right-0 top-full z-50 mt-2 min-w-[280px]"
                    role="menu"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:from-white/5 dark:to-transparent" />
                    <div className="relative space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(authState === 'none' ? '/auth' : '/user')
                          setUserMenuOpen(false)
                        }}
                        className={cn('nav-chip-button relative w-full justify-start px-4 py-3', !userMenuActive && authState === 'none' && 'nav-chip-active')}
                        style={{ ['--nav-accent' as string]: '#2f6c62', ['--nav-soft' as string]: 'rgba(91, 168, 154, 0.17)' }}
                        role="menuitem"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cinnabar/80 via-imperial-yellow/80 to-amber-500/80 text-white shadow-sm">
                          <User className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </span>
                        <span className="flex min-w-0 flex-col items-start">
                          <span className="font-semibold">{userLabel}</span>
                          <span className="text-[11px] font-medium text-muted-foreground dark:text-white/62">
                            {authState === 'none' ? '进入登录与身份入口' : '打开个人档案与训练记录'}
                          </span>
                        </span>
                      </button>

                      {userMenuItems.map((item) => {
                        const active = isActive(item.path)
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => {
                              navigate(item.path)
                              setUserMenuOpen(false)
                            }}
                            className={cn('nav-chip-button relative w-full justify-start px-4 py-3', active && 'nav-chip-active')}
                            style={{ ['--nav-accent' as string]: item.accent, ['--nav-soft' as string]: item.soft }}
                            role="menuitem"
                          >
                            <MenuBadge item={item} active={active} compact />
                            <span className="flex min-w-0 flex-col items-start">
                              <span className="font-semibold">{item.label}</span>
                              <span className={cn('text-[11px] font-medium', active ? 'text-white/72' : 'text-muted-foreground dark:text-white/62')}>
                                {item.hint}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              data-nav-action
              className="premium-icon-button h-10 w-10 xl:hidden"
              aria-label={mobileOpen ? '关闭移动导航' : '打开移动导航'}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div ref={floatingRef} className="fixed bottom-8 left-3 z-[9999] hidden 2xl:block">
        <div className="relative h-[70px] w-[70px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {floatingNavItems.map((item, index) => (
              <FloatingAction
                key={item.path}
                item={item}
                index={index}
                open={sidebarOpen}
                active={isActive(item.path)}
                onClick={() => {
                  navigate(item.path)
                  setSidebarOpen(false)
                }}
              />
            ))}
          </div>

          <motion.button
            type="button"
            aria-label="快捷导航"
            onClick={() => setSidebarOpen((value) => !value)}
            animate={
              sidebarOpen
                ? {
                    boxShadow: '0 20px 40px -24px rgba(201,106,24,0.8)',
                    y: -3,
                    scale: 1.05,
                  }
                : {
                    boxShadow: '0 16px 30px -20px rgba(24,34,52,0.42)',
                    y: 0,
                    scale: 1,
                  }
            }
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="nav-fab-trigger absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.span
              animate={sidebarOpen ? { rotate: 45, scale: 1.05 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-[4px] rounded-full"
              style={{ background: 'linear-gradient(145deg, rgba(201,106,24,0.25), rgba(255,206,96,0.18))' }}
            />
            <motion.span
              animate={sidebarOpen ? { scale: 1.08, opacity: 0.72 } : { scale: 1, opacity: 0.42 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-[3px] rounded-full border border-white/45 dark:border-white/10"
            />
            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cinnabar/90 via-[#d88a21] to-[#f0c55c] text-white shadow-cinnabar transition-all hover:shadow-lg">
              <Menu className="h-5 w-5" strokeWidth={2.3} />
            </span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="关闭导航遮罩"
              className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overlay-panel fixed inset-x-3 top-[74px] z-[41] mx-auto max-h-[calc(100dvh-86px)] overflow-y-auto rounded-[28px] p-4 md:inset-x-5 md:top-[84px] md:p-5 xl:hidden"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 rounded-[24px] border border-white/35 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <div className="text-base font-black text-foreground">营造新途 · 导航</div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">千年营造，创意新生。核心内容模块直接展示，用户功能单独收进个人菜单，导航逻辑更清晰。</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(authState === 'none' ? '/auth' : '/user')
                      setMobileOpen(false)
                    }}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/35 bg-white/80 text-foreground dark:border-white/10 dark:bg-white/10"
                    aria-label={userLabel}
                  >
                    <User className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {coreNavItems.map((item) => (
                    <MobileEntry
                      key={item.path}
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => {
                        navigate(item.path)
                        setMobileOpen(false)
                      }}
                    />
                  ))}
                </div>

                <div className="rounded-[24px] border border-white/35 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 text-sm font-semibold text-foreground">用户功能</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {userMenuItems.map((item) => (
                      <MobileEntry
                        key={item.path}
                        item={item}
                        active={isActive(item.path)}
                        onClick={() => {
                          navigate(item.path)
                          setMobileOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
