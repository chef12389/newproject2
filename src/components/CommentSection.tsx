import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, MessageSquare, Send, Users } from 'lucide-react'
import { CommentItem } from './CommentItem'
import {
  COMMENT_LIMITS,
  COMMENT_PAGE_KEY,
  COMMENTS_UPDATED_EVENT,
  type Comment,
  addComment,
  getAllComments,
  getCommentStats,
  listComments,
  migrateLegacyCommentsToCloud,
  subscribeComments,
} from '@/lib/comments'
import { getActiveProfileId, getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface CommentSectionProps {
  className?: string
  compact?: boolean
}

type SortMode = 'newest' | 'oldest' | 'popular'
type BannerState = { type: 'success' | 'error'; message: string } | null

const commentPromptSeeds = ['我最想补充的一点是……', '如果放回历史语境里看，我会这样理解……', '这组内容里最值得继续展开的是……']

function getDraftKey(profileId: string) {
  return `site-comment-draft:${profileId}`
}

export function CommentSection({ className, compact = false }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortMode>('newest')
  const [banner, setBanner] = useState<BannerState>(null)
  const [stats, setStats] = useState({ total: 0, totalReplies: 0, totalLikes: 0, activeUsers: 0, discussionCount: 0 })

  const currentUserId = currentUser?.id
  const currentUserName = currentUser?.name
  const activeProfileId = getActiveProfileId()
  const canSubmit =
    Boolean(currentUserName) &&
    content.trim().length >= COMMENT_LIMITS.commentMinLength &&
    content.trim().length <= COMMENT_LIMITS.commentMaxLength

  const refreshComments = useCallback(async () => {
    await listComments(COMMENT_PAGE_KEY)
    setComments(getAllComments())
    setStats(await getCommentStats())
  }, [])

  useEffect(() => {
    void (async () => {
      setIsLoading(true)
      try {
        if (getCurrentUser()) {
          await migrateLegacyCommentsToCloud(COMMENT_PAGE_KEY)
        }
        await refreshComments()
      } catch (error) {
        setBanner({
          type: 'error',
          message: error instanceof Error ? error.message : '评论加载失败，请稍后重试。',
        })
      } finally {
        setIsLoading(false)
      }
    })()
  }, [refreshComments])

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(getDraftKey(activeProfileId))
    if (savedDraft) {
      setContent(savedDraft)
    }
  }, [activeProfileId])

  useEffect(() => {
    const syncUser = async () => {
      const nextUser = getCurrentUser()
      setCurrentUser(nextUser)
      if (nextUser) {
        await migrateLegacyCommentsToCloud(COMMENT_PAGE_KEY)
        await refreshComments()
      }
    }

    const handleAuthUpdated = () => {
      void syncUser()
    }

    window.addEventListener('auth-updated', handleAuthUpdated)

    return () => window.removeEventListener('auth-updated', handleAuthUpdated)
  }, [refreshComments])

  useEffect(() => {
    const syncComments = async () => {
      setComments(getAllComments())
      setStats(await getCommentStats())
    }
    const handleCommentsUpdated = () => {
      void syncComments()
    }

    const subscription = subscribeComments(COMMENT_PAGE_KEY, () => {
      void syncComments()
    })

    window.addEventListener(COMMENTS_UPDATED_EVENT, handleCommentsUpdated)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener(COMMENTS_UPDATED_EVENT, handleCommentsUpdated)
    }
  }, [])

  useEffect(() => {
    if (!banner) {
      return
    }

    const timer = window.setTimeout(() => setBanner(null), 3200)
    return () => window.clearTimeout(timer)
  }, [banner])

  useEffect(() => {
    window.localStorage.setItem(getDraftKey(activeProfileId), content)
  }, [activeProfileId, content])

  const visibleComments = useMemo(() => {
    const nextComments = [...comments]

    switch (sortBy) {
      case 'oldest':
        nextComments.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'popular':
        nextComments.sort((a, b) => b.likes + b.replies.length * 2 - (a.likes + a.replies.length * 2) || b.createdAt - a.createdAt)
        break
      case 'newest':
      default:
        nextComments.sort((a, b) => b.createdAt - a.createdAt)
    }

    return nextComments
  }, [comments, sortBy])

  const handleBanner = async (message?: string, type: 'success' | 'error' = 'success') => {
    await refreshComments()
    if (message) {
      setBanner({ message, type })
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!currentUserId || !currentUserName) {
      setBanner({ type: 'error', message: '请先登录后再发表评论。' })
      return
    }

    setIsSubmitting(true)
    setBanner(null)

    try {
      await addComment(currentUserId, currentUserName, content)
      setContent('')
      window.localStorage.removeItem(getDraftKey(activeProfileId))
      await handleBanner('评论已发布，其他打开同一页面的用户会自动看到。')
    } catch (error) {
      setBanner({
        type: 'error',
        message: error instanceof Error ? error.message : '发表评论失败，请稍后重试。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('space-y-5', className)}>
      {compact ? null : (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black text-foreground">全站统一评论区</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              这里的评论会写入云端数据库，登录同一账号后可在不同浏览器继续查看，新的评论和回复也会自动同步到当前页面。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[22px] border border-white/45 bg-white/78 p-1.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
            {(
              [
                ['newest', '最新发布'],
                ['popular', '热门讨论'],
                ['oldest', '最早发布'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortBy(value)}
                className={cn(
                  'min-h-[40px] rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                  sortBy === value ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-white hover:text-foreground dark:hover:bg-white/10',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {banner ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              'rounded-[24px] border px-4 py-3 text-sm font-medium',
              banner.type === 'success'
                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
            )}
          >
            {banner.message}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={cn(compact ? 'space-y-4' : 'grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start')}>
        <aside className={cn(compact ? '' : 'xl:sticky xl:top-32')}>
          <div className="surface-card-strong rounded-[28px] p-5 md:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[22px] border border-white/35 bg-white/[0.68] p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">主评论</div>
                <div className="mt-2 text-2xl font-black text-foreground">{stats.total}</div>
              </div>
              <div className="rounded-[22px] border border-white/35 bg-white/[0.68] p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Flame className="h-3.5 w-3.5" />
                  回复与点赞
                </div>
                <div className="mt-2 text-2xl font-black text-foreground">{stats.totalReplies + stats.totalLikes}</div>
              </div>
              <div className="rounded-[22px] border border-white/35 bg-white/[0.68] p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  参与者
                </div>
                <div className="mt-2 text-2xl font-black text-foreground">{stats.activeUsers}</div>
              </div>
            </div>

            <div className="mt-5 border-t border-border/50 pt-5">
              <div className="text-lg font-black text-foreground">发表评论</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">登录后即可在不同浏览器继续查看自己发过的评论，并和其他用户实时交流。</p>
            </div>

            <div className="mt-4">
              {currentUserName ? (
                <div className="rounded-[20px] border border-white/45 bg-white/72 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/8">
                  当前以 <span className="font-semibold text-foreground">{currentUserName}</span> 的身份发言。
                </div>
              ) : (
                <div className="rounded-[20px] border border-cinnabar/20 bg-cinnabar/10 px-4 py-3 text-sm text-cinnabar">登录后即可参与评论与回复。</div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {commentPromptSeeds.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setContent((current) => (current.trim() ? `${current}\n${seed}` : seed))}
                    className="rounded-full border border-white/50 bg-white/72 px-3 py-2 text-xs font-medium leading-5 text-foreground transition-colors hover:bg-white/90 dark:border-white/10 dark:bg-white/6"
                  >
                    {seed}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  rows={compact ? 4 : 7}
                  maxLength={COMMENT_LIMITS.commentMaxLength}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="写下你的看法、补充资料，或你想继续展开的问题。"
                  className="w-full resize-none rounded-[22px] border border-border/60 bg-white/80 px-4 py-4 text-sm leading-7 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-white/5"
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    至少 {COMMENT_LIMITS.commentMinLength} 字，最多 {COMMENT_LIMITS.commentMaxLength} 字。
                  </span>
                  <span className="text-muted-foreground">{content.length}/{COMMENT_LIMITS.commentMaxLength}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="hero-primary-cta inline-flex min-h-[48px] items-center justify-center gap-2 !px-4 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? '发布中…' : '发布评论'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContent('')
                    window.localStorage.removeItem(getDraftKey(activeProfileId))
                  }}
                  className="hero-secondary-cta inline-flex min-h-[48px] items-center justify-center gap-2 !px-4 !py-2.5 text-sm"
                >
                  清空草稿
                </button>
              </div>
            </form>
          </div>
        </aside>

        <div className="space-y-4">
          {isLoading ? (
            <div className="surface-card rounded-[28px] p-10 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-black text-foreground">评论加载中</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">正在从云端同步评论内容……</p>
            </div>
          ) : visibleComments.length === 0 ? (
            <div className="surface-card rounded-[28px] p-10 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-black text-foreground">还没有评论</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">第一条评论发出后，其他打开页面的用户会自动看到。</p>
            </div>
          ) : (
            visibleComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} currentUserName={currentUserName} onChanged={handleBanner} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
