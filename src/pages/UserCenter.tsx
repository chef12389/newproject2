import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Check,
  Clock3,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PencilLine,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  User2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { allCases, categoryData, getCategoryName, moduleCards } from '@/data/architectureData'
import { getTrainingTopic } from '@/data/trainingData'
import { getActiveProfileName, getCurrentUser, getGuestProfile, logoutUser, updateCurrentUserProfile, updateGuestProfile } from '@/lib/auth'
import { useSectionReveal } from '@/lib/cinematic'
import { getUserCommentSummary, getUserComments } from '@/lib/comments'
import { cardHoverQuick, cardPressQuick, fastCardRevealVariants, viewportCardRevealVariants } from '@/lib/motion'
import { getJourneyState, resetJourney, trackPageVisit, type JourneyState } from '@/lib/progress'
import { getImageUrl } from '@/lib/utils'

type ArchiveMetric = {
  label: string
  value: string
  note: string
}

const emptyCommentSummary = {
  totalComments: 0,
  totalReplies: 0,
  totalLikesReceived: 0,
}

function getTrainingModeLabel(mode: string) {
  switch (mode) {
    case 'single':
      return '专题问答'
    case 'judge':
      return '判断强化'
    case 'visual':
      return '图像识别'
    case 'structure':
      return '结构问答'
    case 'challenge':
      return '专题闯关'
    case 'puzzle':
      return '拼图训练'
    default:
      return mode
  }
}

export default function UserCenter() {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement | null>(null)
  const initialUser = getCurrentUser()
  const [journey, setJourney] = useState<JourneyState>(getJourneyState())
  const [profileName, setProfileName] = useState(getActiveProfileName())
  const [guestMode, setGuestMode] = useState(!initialUser)
  const [lastLoginAt, setLastLoginAt] = useState(initialUser?.lastLoginAt ?? '')
  const [profileDraftName, setProfileDraftName] = useState(initialUser?.name ?? getGuestProfile().name)
  const [profileDraftBio, setProfileDraftBio] = useState(initialUser?.bio ?? '')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [myComments, setMyComments] = useState<any[]>([])
  const [commentSummary, setCommentSummary] = useState(emptyCommentSummary)

  useEffect(() => {
    trackPageVisit('/user')

    const sync = async () => {
      const nextUser = getCurrentUser()
      setJourney(getJourneyState())
      setProfileName(getActiveProfileName())
      setGuestMode(!nextUser)
      setLastLoginAt(nextUser?.lastLoginAt ?? '')
      setProfileDraftName(nextUser?.name ?? getGuestProfile().name)
      setProfileDraftBio(nextUser?.bio ?? '')

      if (nextUser) {
        const [nextComments, nextSummary] = await Promise.all([getUserComments(nextUser.id), getUserCommentSummary(nextUser.id)])
        setMyComments(nextComments)
        setCommentSummary(nextSummary)
      } else {
        setMyComments([])
        setCommentSummary(emptyCommentSummary)
      }
    }

    void sync()
    const handleSync = () => {
      void sync()
    }
    window.addEventListener('journey-updated', handleSync)
    window.addEventListener('auth-updated', handleSync)
    window.addEventListener('comments-updated', handleSync)

    return () => {
      window.removeEventListener('journey-updated', handleSync)
      window.removeEventListener('auth-updated', handleSync)
      window.removeEventListener('comments-updated', handleSync)
    }
  }, [])

  useEffect(() => {
    if (!profileMessage) {
      return
    }

    const timer = window.setTimeout(() => setProfileMessage(''), 2600)
    return () => window.clearTimeout(timer)
  }, [profileMessage])

  useSectionReveal(pageRef)

  const completionRate = useMemo(() => {
    const total = moduleCards.length + categoryData.length + 3 + 1
    const completed =
      journey.visitedPages.length +
      journey.exploredCategories.length +
      journey.completedPuzzles.length +
      (journey.bestQuizScore > 0 ? 1 : 0)

    return Math.min(100, Math.round((completed / total) * 100))
  }, [journey])

  const favoriteCases = allCases.filter((item) => journey.favoriteCases.includes(item.id))
  const recentCases = allCases.filter((item) => journey.viewedCases.includes(item.id)).slice(-4).reverse()
  const recentTrainingSessions = journey.recentTraining.slice(0, 3)
  const trainingAccuracy =
    journey.recentTraining.length === 0
      ? 0
      : Math.round(
          (journey.recentTraining.reduce((sum, item) => sum + (item.total === 0 ? 0 : item.score / item.total), 0) /
            journey.recentTraining.length) *
            100,
        )

  const achievements = [
    { label: '全站探索者', note: '访问 5 个以上主要功能页。', unlocked: journey.visitedPages.length >= 5 },
    { label: '类型研究者', note: '探索 4 类以上建筑类型。', unlocked: journey.exploredCategories.length >= 4 },
    { label: '图像收藏者', note: '收藏至少 3 个案例。', unlocked: favoriteCases.length >= 3 },
    { label: '拼图完成者', note: '完成至少 2 轮拼图。', unlocked: journey.completedPuzzles.length >= 2 },
    { label: '问答稳定者', note: '综合问答历史最好成绩达到 6 分。', unlocked: journey.bestQuizScore >= 6 },
    { label: '深度浏览者', note: '进入过至少 6 个案例。', unlocked: journey.viewedCases.length >= 6 },
  ]

  const archiveMetrics: ArchiveMetric[] = [
    { label: '访问页面', value: `${journey.visitedPages.length}`, note: '已经进入过的主要页面数量' },
    { label: '探索类型', value: `${journey.exploredCategories.length}`, note: '已经打开过的建筑类型数量' },
    { label: '浏览案例', value: `${journey.viewedCases.length}`, note: '进入过的具体案例数量' },
    { label: '最佳成绩', value: `${journey.bestQuizScore}`, note: '综合问答历史最高得分' },
  ]

  const unlockedCount = achievements.filter((item) => item.unlocked).length
  const currentUser = getCurrentUser()

  const handleProfileSave = async () => {
    setProfileMessage('')
    setProfileError('')

    if (guestMode) {
      const result = updateGuestProfile({ name: profileDraftName })
      if (!result.ok) {
        setProfileError(result.message)
        return
      }

      setProfileName(result.profile.name)
      setProfileMessage('访客昵称已保存。')
      return
    }

    const result = await updateCurrentUserProfile({
      name: profileDraftName,
      bio: profileDraftBio,
      avatar: profileDraftName.trim().charAt(0).toUpperCase(),
    })

    if (!result.ok) {
      setProfileError(result.message)
      return
    }

    setProfileName(result.user.name)
    setProfileMessage('资料已保存，评论展示会自动使用最新资料。')
  }

  return (
    <div ref={pageRef} className="page-shell">
      <GlobalNav />

      <section className="page-header" data-cine-section>
        <div className="page-header-inner">
          <div className="liquid-panel relative overflow-hidden px-6 py-8 md:px-10 md:py-10" data-cine-step>
            <div className="hero-orb hero-orb-cinnabar" style={{ width: 240, height: 240, top: '-10%', right: '-2%' }} />
            <div className="hero-orb hero-orb-azure" style={{ width: 220, height: 220, bottom: '-12%', left: '-3%' }} />

            <div className="relative z-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-3xl">
                <div className="section-kicker mb-4">{guestMode ? '访客档案' : '个人档案'}</div>
                <h1 className="page-title mb-4">{guestMode ? '你的访客探索档案' : '你的浏览、收藏与评论档案'}</h1>
                <p className="page-subtitle max-w-[36ch] sm:max-w-[36ch]">
                  {guestMode
                    ? '当前处于访客模式，数据仅保存在当前浏览器。注册正式账号后，才能在不同浏览器登录并继续查看评论与资料。'
                    : '当前账号下的资料、评论、收藏和训练记录都会集中展示在这里，方便你持续回看自己的学习路径。'}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button type="button" onClick={() => navigate('/')} className="hero-secondary-cta inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    返回首页
                  </button>
                  {guestMode ? (
                    <button type="button" onClick={() => navigate('/auth')} className="hero-primary-cta inline-flex items-center gap-2">
                      升级为正式账号
                      <Sparkles className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        await logoutUser()
                        navigate('/auth')
                      }}
                      className="hero-primary-cta inline-flex items-center gap-2"
                    >
                      退出当前账号
                      <LogOut className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <motion.article
                  className="surface-card home-paper-panel rounded-[22px] p-5"
                  variants={viewportCardRevealVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.25 }}
                  whileHover={cardHoverQuick}
                  whileTap={cardPressQuick}
                >
                  <div className="flex items-start gap-4">
                    <div className="home-guide-icon">
                      <User2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{guestMode ? 'Guest Profile' : 'Account Profile'}</div>
                      <div className="mt-1 text-2xl font-black tracking-[-0.04em] text-foreground">{profileName}</div>
                      <div className="mt-2 text-sm leading-7 text-muted-foreground">
                        {guestMode ? '访客身份仅保存本地昵称和浏览记录。' : currentUser?.bio || '你还没有填写个人简介，可以在下方资料设置中补充。'}
                      </div>
                    </div>
                  </div>
                </motion.article>

                <motion.article
                  className="surface-card home-paper-panel rounded-[22px] p-5"
                  variants={viewportCardRevealVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 0.04 }}
                  whileHover={cardHoverQuick}
                  whileTap={cardPressQuick}
                >
                  <div className="flex items-start gap-4">
                    <div className="home-guide-icon">{guestMode ? <ShieldCheck className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{guestMode ? 'Local Archive' : 'Last Login'}</div>
                      <div className="mt-1 text-lg font-black tracking-[-0.03em] text-foreground">
                        {guestMode ? '当前为访客模式' : lastLoginAt ? new Date(lastLoginAt).toLocaleString('zh-CN') : '暂无记录'}
                      </div>
                      <div className="mt-2 text-sm leading-7 text-muted-foreground">
                        {guestMode ? '更换设备或清理浏览器缓存后，访客数据可能丢失。' : '昵称与简介更新后，评论区会自动展示新的资料。'}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-main pt-8">
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="space-y-6">
            <motion.article className="surface-card-strong home-paper-panel rounded-[26px] p-6 md:p-7" variants={fastCardRevealVariants} initial="initial" animate="animate">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="section-kicker mb-3">{guestMode ? '访客总览' : '档案总览'}</div>
                  <h2 className="text-2xl font-black text-foreground">{guestMode ? '临时探索记录' : '持续探索记录'}</h2>
                </div>
                <div className="rounded-full border border-white/45 bg-white/72 px-4 py-2 text-sm font-semibold text-foreground dark:border-white/10 dark:bg-white/10">完成度 {completionRate}%</div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/45">
                <div className="h-3 rounded-full bg-[linear-gradient(90deg,#a63d2b,#bf6b2d,#5b7da1)] transition-all duration-700" style={{ width: `${completionRate}%` }} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {archiveMetrics.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-white/40 bg-white/70 p-4">
                    <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{item.label}</div>
                    <div className="mt-3 font-serif text-3xl font-black text-foreground">{item.value}</div>
                    <div className="mt-2 text-xs leading-6 text-muted-foreground">{item.note}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetJourney()
                    setJourney(getJourneyState())
                  }}
                  className="hero-secondary-cta inline-flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  清空档案
                </button>
                {guestMode ? (
                  <button type="button" onClick={() => navigate('/auth')} className="hero-secondary-cta inline-flex items-center gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4" />
                    绑定正式账号
                  </button>
                ) : null}
              </div>
            </motion.article>

            <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.16 }}>
              <div className="mb-4 flex items-center gap-2">
                <PencilLine className="h-4 w-4 text-primary" />
                <h2 className="text-xl font-black text-foreground">资料设置</h2>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="mb-2 text-sm font-semibold text-foreground">{guestMode ? '访客昵称' : '显示昵称'}</div>
                  <input
                    value={profileDraftName}
                    onChange={(event) => setProfileDraftName(event.target.value)}
                    className="w-full rounded-[18px] border border-white/35 bg-white/75 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 dark:border-white/10 dark:bg-white/5"
                    placeholder={guestMode ? '请输入访客昵称' : '请输入显示昵称'}
                  />
                </label>

                {guestMode ? null : (
                  <label className="block">
                    <div className="mb-2 text-sm font-semibold text-foreground">个人简介</div>
                    <textarea
                      rows={4}
                      maxLength={120}
                      value={profileDraftBio}
                      onChange={(event) => setProfileDraftBio(event.target.value)}
                      className="w-full rounded-[18px] border border-white/35 bg-white/75 px-4 py-3 text-sm leading-7 text-foreground outline-none focus:ring-2 focus:ring-primary/25 dark:border-white/10 dark:bg-white/5"
                      placeholder="介绍一下你的关注方向。"
                    />
                    <div className="mt-2 text-right text-xs text-muted-foreground">{profileDraftBio.length}/120</div>
                  </label>
                )}

                {currentUser?.email ? (
                  <div className="rounded-[18px] border border-white/35 bg-white/65 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
                    当前账号邮箱：<span className="font-semibold text-foreground">{currentUser.email}</span>
                  </div>
                ) : null}

                {profileError ? <div className="status-banner-error">{profileError}</div> : null}
                {profileMessage ? <div className="status-banner-success">{profileMessage}</div> : null}

                <button type="button" onClick={() => void handleProfileSave()} className="hero-primary-cta inline-flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4" />
                  保存资料
                </button>
              </div>
            </motion.article>

            <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.16 }}>
              <div className="mb-4 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xl font-black text-foreground">模块进度</h2>
              </div>
              <div className="space-y-3">
                {moduleCards.map((item) => {
                  const visited = journey.visitedPages.includes(item.route)

                  return (
                    <div key={item.route} className="rounded-[20px] border border-white/35 bg-white/68 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground">{item.title}</div>
                          <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${visited ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-imperial-yellow' : 'bg-white/80 text-muted-foreground dark:bg-white/10'}`}>
                          {visited ? '已进入' : '未进入'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.article>
          </section>

          <section className="space-y-6">
            <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.12 }}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-cinnabar" />
                  <h2 className="text-xl font-black text-foreground">评论档案</h2>
                </div>
                {!guestMode ? (
                  <span className="rounded-full border border-white/35 bg-white/72 px-3 py-1 text-xs font-semibold text-foreground dark:border-white/10 dark:bg-white/10">{commentSummary.totalComments} 条主评论</span>
                ) : null}
              </div>

              {guestMode ? (
                <div className="rounded-[20px] border border-white/35 bg-white/70 p-5 text-sm leading-7 text-muted-foreground">
                  访客模式下不支持跨浏览器评论档案。登录后，你的评论、回复和获得的点赞都会保存在正式账号下。
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                      <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">主评论</div>
                      <div className="mt-3 text-3xl font-black text-foreground">{commentSummary.totalComments}</div>
                    </div>
                    <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                      <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">回复数</div>
                      <div className="mt-3 text-3xl font-black text-foreground">{commentSummary.totalReplies}</div>
                    </div>
                    <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                      <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">收到赞同</div>
                      <div className="mt-3 text-3xl font-black text-foreground">{commentSummary.totalLikesReceived}</div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {myComments.length === 0 ? (
                      <div className="rounded-[20px] border border-white/35 bg-white/70 p-5 text-sm leading-7 text-muted-foreground">
                        你还没有发表过评论。前往评论交流页后，发布的内容会保存在当前账号下，并在不同浏览器登录后继续可见。
                      </div>
                    ) : (
                      myComments
                        .slice()
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 5)
                        .map((item) => (
                          <div key={item.id} className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                              <span>{item.replies.length} 条回复</span>
                              <span>{item.likes} 次点赞</span>
                            </div>
                            <div className="mt-2 text-sm leading-7 text-foreground">{item.content}</div>
                          </div>
                        ))
                    )}
                  </div>
                </>
              )}
            </motion.article>

            <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.12 }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-cinnabar" />
                  <h2 className="text-xl font-black text-foreground">训练概况</h2>
                </div>
                <span className="rounded-full border border-white/35 bg-white/72 px-3 py-1 text-xs font-semibold text-foreground dark:border-white/10 dark:bg-white/10">平均正确率 {trainingAccuracy}%</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                  <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">已完成专题</div>
                  <div className="mt-3 text-3xl font-black text-foreground">{journey.trainingTopics.length}</div>
                </div>
                <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                  <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">错题本</div>
                  <div className="mt-3 text-3xl font-black text-foreground">{journey.wrongAnswers.length}</div>
                </div>
                <div className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                  <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">最近训练</div>
                  <div className="mt-3 text-3xl font-black text-foreground">{journey.recentTraining.length}</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentTrainingSessions.length === 0 ? (
                  <div className="rounded-[20px] border border-white/35 bg-white/70 p-5 text-sm leading-7 text-muted-foreground">还没有新的训练记录。进入创意训练中心后，结果会同步回到这里。</div>
                ) : (
                  recentTrainingSessions.map((item, index) => (
                    <div key={`${item.topicId}-${item.timestamp}-${index}`} className="rounded-[20px] border border-white/35 bg-white/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-foreground">{getTrainingTopic(item.topicId).label}</div>
                        <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString('zh-CN')}</div>
                      </div>
                      <div className="mt-2 text-sm leading-6 text-muted-foreground">
                        模式：{getTrainingModeLabel(item.mode)}，得分 {item.score}/{item.total}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.article>

            <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.12 }}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cinnabar" />
                  <h2 className="text-xl font-black text-foreground">成就系统</h2>
                </div>
                <span className="rounded-full border border-white/35 bg-white/72 px-3 py-1 text-xs font-semibold text-foreground dark:border-white/10 dark:bg-white/10">
                  {unlockedCount} / {achievements.length} 已解锁
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {achievements.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[20px] border p-4 ${item.unlocked ? 'border-primary/20 bg-[linear-gradient(180deg,rgba(233,242,249,0.96),rgba(226,236,246,0.94))] dark:border-primary/25 dark:bg-[linear-gradient(180deg,rgba(32,44,60,0.72),rgba(22,30,40,0.82))]' : 'border-white/35 bg-white/72 dark:border-white/10 dark:bg-white/5'}`}
                  >
                    <div className={`font-bold ${item.unlocked ? 'text-primary dark:text-imperial-yellow' : 'text-foreground'}`}>{item.label}</div>
                    <div className={`mt-2 text-sm leading-6 ${item.unlocked ? 'text-primary/80 dark:text-slate-300' : 'text-muted-foreground'}`}>{item.note}</div>
                  </div>
                ))}
              </div>
            </motion.article>

            <div className="grid gap-6 xl:grid-cols-2">
              <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.12 }}>
                <div className="mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-cinnabar" />
                  <h2 className="text-xl font-black text-foreground">收藏案例</h2>
                </div>
                {favoriteCases.length === 0 ? (
                  <div className="rounded-[20px] border border-white/35 bg-white/70 p-5 text-sm leading-7 text-muted-foreground">还没有收藏案例。你可以先去图像展廊或类型档案，把重点样本加入收藏。</div>
                ) : (
                  <div className="grid gap-4">
                    {favoriteCases.slice(0, 3).map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => navigate('/gallery')}
                        className="overflow-hidden rounded-[22px] border border-white/35 bg-white/72 text-left transition-transform hover:scale-[1.01]"
                        whileHover={cardHoverQuick}
                        whileTap={cardPressQuick}
                      >
                        <img src={getImageUrl(item.image)} alt={item.name} className="h-32 w-full object-cover" />
                        <div className="p-4">
                          <div className="font-bold text-foreground">{item.name}</div>
                          <div className="mt-1 text-sm text-primary dark:text-imperial-yellow">
                            {getCategoryName(item.categoryId)} · {item.location}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.article>

              <motion.article className="surface-card home-paper-panel rounded-[26px] p-6" variants={viewportCardRevealVariants} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.12 }}>
                <div className="mb-4 flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <h2 className="text-xl font-black text-foreground">最近浏览</h2>
                </div>
                {recentCases.length === 0 ? (
                  <div className="rounded-[20px] border border-white/35 bg-white/70 p-5 text-sm leading-7 text-muted-foreground">还没有近期浏览记录。先去首页或图像展廊挑一个入口开始。</div>
                ) : (
                  <div className="space-y-3">
                    {recentCases.map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(`/architecture/${item.categoryId}`)}
                        className="flex w-full items-center gap-4 rounded-[20px] border border-white/35 bg-white/72 p-4 text-left transition-transform hover:scale-[1.01]"
                        whileHover={cardHoverQuick}
                        whileTap={cardPressQuick}
                      >
                        <img src={getImageUrl(item.image)} alt={item.name} className="h-16 w-20 flex-none rounded-[16px] object-cover" />
                        <div className="min-w-0">
                          <div className="font-bold text-foreground">{item.name}</div>
                          <div className="mt-1 text-sm text-primary dark:text-imperial-yellow">
                            {getCategoryName(item.categoryId)} · {item.year}
                          </div>
                          <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.summary}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.article>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
