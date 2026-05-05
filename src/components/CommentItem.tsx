import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, MessageSquare, Pencil, Send, ThumbsUp, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  COMMENT_LIMITS,
  type Comment,
  type CommentReply,
  addReply,
  deleteComment,
  deleteReply,
  formatCommentTime,
  hasLiked,
  toggleLikeComment,
  updateComment,
  updateReply,
} from '@/lib/comments'

interface CommentItemProps {
  comment: Comment
  currentUserId?: string
  currentUserName?: string
  onChanged: (message?: string, type?: 'success' | 'error') => Promise<void> | void
}

const actionButtonClass = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors'

export function CommentItem({ comment, currentUserId, currentUserName, onChanged }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(comment.replies.length > 0)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyError, setReplyError] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState(comment.content)
  const [commentError, setCommentError] = useState('')
  const [isSavingComment, setIsSavingComment] = useState(false)

  const isLiked = hasLiked(comment.id)
  const canDelete = Boolean(currentUserId && comment.userId === currentUserId)
  const canReply = Boolean(currentUserName)
  const sortedReplies = useMemo(() => [...comment.replies].sort((a, b) => a.createdAt - b.createdAt), [comment.replies])
  const commentEdited = Boolean(comment.updatedAt && comment.updatedAt > comment.createdAt)

  useEffect(() => {
    if (!isEditing) {
      setDraftContent(comment.content)
    }
  }, [comment.content, isEditing])

  useEffect(() => {
    if (comment.replies.length === 0) {
      setShowReplies(false)
    }
  }, [comment.replies.length])

  const handleLike = async () => {
    try {
      const liked = await toggleLikeComment(comment.id)
      await onChanged(liked ? '已点赞这条评论。' : '已取消点赞。')
    } catch (error) {
      await onChanged(error instanceof Error ? error.message : '点赞失败，请稍后重试。', 'error')
    }
  }

  const handleDelete = async () => {
    if (!canDelete) {
      return
    }

    if (window.confirm('确定要删除这条评论吗？')) {
      try {
        const deleted = await deleteComment(comment.id, currentUserId || '')
        await onChanged(deleted ? '评论已删除。' : '删除失败，请稍后重试。', deleted ? 'success' : 'error')
      } catch (error) {
        await onChanged(error instanceof Error ? error.message : '删除失败，请稍后重试。', 'error')
      }
    }
  }

  const handleReplySubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!replyText.trim() || !currentUserId || !currentUserName) {
      return
    }

    setIsSubmittingReply(true)
    setReplyError('')

    try {
      const createdReply = await addReply(comment.id, currentUserId, currentUserName, replyText)
      if (!createdReply) {
        setReplyError('回复失败，请稍后重试。')
        return
      }

      setReplyText('')
      setShowReplyForm(false)
      setShowReplies(true)
      await onChanged('回复已发布。')
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : '回复失败，请稍后重试。')
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleCommentSave = async () => {
    if (!currentUserId) {
      return
    }

    setIsSavingComment(true)
    setCommentError('')

    try {
      const updated = await updateComment(comment.id, currentUserId, draftContent)
      if (!updated) {
        setCommentError('保存失败，请稍后重试。')
        return
      }

      setIsEditing(false)
      await onChanged('评论已更新。')
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : '保存失败，请稍后重试。')
    } finally {
      setIsSavingComment(false)
    }
  }

  return (
    <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card rounded-[24px] p-5 md:p-6">
      <div className="flex gap-4">
        <div className="flex-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-[18px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,252,248,0.94),rgba(243,237,227,0.9))] text-sm font-black text-foreground">
            {(comment.userAvatar || comment.userName.charAt(0)).toUpperCase()}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-base font-black text-foreground">{comment.userName}</span>
                <span className="rounded-full border border-border/50 bg-white/78 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground dark:bg-white/5">
                  {formatCommentTime(comment.createdAt)}
                </span>
                {commentEdited ? <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">已编辑</span> : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{comment.replies.length} 条回复</span>
                <span>{comment.likes} 次点赞</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="comment-edit" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-4 rounded-[20px] border border-border/60 bg-white/80 p-4 dark:bg-white/5">
                <textarea
                  rows={4}
                  maxLength={COMMENT_LIMITS.commentMaxLength}
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-black/10"
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={commentError ? 'text-red-500' : 'text-muted-foreground'}>
                    {commentError || `评论最多 ${COMMENT_LIMITS.commentMaxLength} 字。`}
                  </span>
                  <span className="text-muted-foreground">{draftContent.length}/{COMMENT_LIMITS.commentMaxLength}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={handleCommentSave} disabled={isSavingComment} className="hero-primary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm">
                    <Check className="h-4 w-4" />
                    {isSavingComment ? '保存中…' : '保存修改'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setCommentError('')
                      setDraftContent(comment.content)
                    }}
                    className="hero-secondary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                  >
                    <X className="h-4 w-4" />
                    取消
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="comment-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
                <p className="whitespace-pre-line text-sm leading-7 text-foreground">{comment.content}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleLike()}
              className={cn(actionButtonClass, isLiked ? 'border-cinnabar/20 bg-cinnabar/10 text-cinnabar' : 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5')}
            >
              <ThumbsUp className={cn('h-3.5 w-3.5', isLiked && 'fill-current')} />
              赞同 {comment.likes}
            </button>

            <button
              type="button"
              onClick={() => setShowReplies((value) => !value)}
              className={cn(
                actionButtonClass,
                comment.replies.length > 0
                  ? 'border-primary/15 bg-primary/10 text-primary'
                  : 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5',
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              回复 {comment.replies.length}
              {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {canReply ? (
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm((value) => !value)
                  setShowReplies(true)
                  setReplyError('')
                }}
                className={cn(actionButtonClass, 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5')}
              >
                <Send className="h-3.5 w-3.5" />
                写回复
              </button>
            ) : null}

            {canDelete ? (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className={cn(actionButtonClass, 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5')}>
                  <Pencil className="h-3.5 w-3.5" />
                  编辑
                </button>
                <button type="button" onClick={() => void handleDelete()} className={cn(actionButtonClass, 'border-red-500/15 bg-red-500/10 text-red-500 hover:bg-red-500/15')}>
                  <Trash2 className="h-3.5 w-3.5" />
                  删除
                </button>
              </>
            ) : null}
          </div>

          <AnimatePresence>
            {showReplyForm && canReply ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-[20px] border border-border/60 bg-white/80 p-4 dark:bg-white/5">
                <form onSubmit={handleReplySubmit}>
                  <div className="mb-2 text-sm font-semibold text-foreground">回复 {comment.userName}</div>
                  <textarea
                    rows={3}
                    maxLength={COMMENT_LIMITS.replyMaxLength}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="补充你的看法、资料或不同角度。"
                    className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-black/10"
                    disabled={isSubmittingReply}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={replyError ? 'text-red-500' : 'text-muted-foreground'}>
                      {replyError || `回复至少 ${COMMENT_LIMITS.replyMinLength} 字。`}
                    </span>
                    <span className="text-muted-foreground">{replyText.length}/{COMMENT_LIMITS.replyMaxLength}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="submit" disabled={!replyText.trim() || isSubmittingReply} className="hero-primary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60">
                      <Send className="h-4 w-4" />
                      {isSubmittingReply ? '发布中…' : '发布回复'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyForm(false)
                        setReplyError('')
                      }}
                      className="hero-secondary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                    >
                      <X className="h-4 w-4" />
                      取消
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showReplies && sortedReplies.length > 0 ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-3 border-l border-[#d8c7aa] pl-4">
                {sortedReplies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} commentId={comment.id} currentUserId={currentUserId} onChanged={onChanged} />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  )
}

interface ReplyItemProps {
  reply: CommentReply
  commentId: string
  currentUserId?: string
  onChanged: (message?: string, type?: 'success' | 'error') => Promise<void> | void
}

function ReplyItem({ reply, commentId, currentUserId, onChanged }: ReplyItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftReply, setDraftReply] = useState(reply.content)
  const [replyError, setReplyError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const isLiked = hasLiked(commentId, reply.id)
  const canDelete = Boolean(currentUserId && reply.userId === currentUserId)
  const replyEdited = Boolean(reply.updatedAt && reply.updatedAt > reply.createdAt)

  useEffect(() => {
    if (!isEditing) {
      setDraftReply(reply.content)
    }
  }, [reply.content, isEditing])

  const handleLike = async () => {
    try {
      const liked = await toggleLikeComment(commentId, reply.id)
      await onChanged(liked ? '已点赞这条回复。' : '已取消点赞。')
    } catch (error) {
      await onChanged(error instanceof Error ? error.message : '点赞失败，请稍后重试。', 'error')
    }
  }

  const handleDelete = async () => {
    if (!canDelete) {
      return
    }
    if (window.confirm('确定要删除这条回复吗？')) {
      try {
        const deleted = await deleteReply(commentId, reply.id, currentUserId || '')
        await onChanged(deleted ? '回复已删除。' : '删除失败，请稍后重试。', deleted ? 'success' : 'error')
      } catch (error) {
        await onChanged(error instanceof Error ? error.message : '删除失败，请稍后重试。', 'error')
      }
    }
  }

  const handleSave = async () => {
    if (!currentUserId) {
      return
    }

    setIsSaving(true)
    setReplyError('')

    try {
      const updated = await updateReply(commentId, reply.id, currentUserId, draftReply)
      if (!updated) {
        setReplyError('保存失败，请稍后重试。')
        return
      }

      setIsEditing(false)
      await onChanged('回复已更新。')
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : '保存失败，请稍后重试。')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-[18px] border border-white/40 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[16px] border border-border/50 bg-[linear-gradient(180deg,rgba(255,252,248,0.94),rgba(243,237,227,0.9))] text-xs font-black text-foreground">
          {(reply.userAvatar || reply.userName.charAt(0)).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">{reply.userName}</span>
            <span className="rounded-full border border-border/50 bg-white/78 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground dark:bg-white/5">{formatCommentTime(reply.createdAt)}</span>
            {replyEdited ? <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">已编辑</span> : null}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="reply-edit" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3">
                <textarea
                  rows={3}
                  maxLength={COMMENT_LIMITS.replyMaxLength}
                  value={draftReply}
                  onChange={(event) => setDraftReply(event.target.value)}
                  className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-black/10"
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={replyError ? 'text-red-500' : 'text-muted-foreground'}>{replyError || `回复最多 ${COMMENT_LIMITS.replyMaxLength} 字。`}</span>
                  <span className="text-muted-foreground">{draftReply.length}/{COMMENT_LIMITS.replyMaxLength}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={handleSave} disabled={isSaving} className="hero-primary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm">
                    <Check className="h-4 w-4" />
                    {isSaving ? '保存中…' : '保存'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="hero-secondary-cta inline-flex items-center gap-2 !px-4 !py-2 text-sm">
                    <X className="h-4 w-4" />
                    取消
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.p key="reply-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">
                {reply.content}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void handleLike()} className={cn(actionButtonClass, isLiked ? 'border-cinnabar/20 bg-cinnabar/10 text-cinnabar' : 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5')}>
              <ThumbsUp className={cn('h-3.5 w-3.5', isLiked && 'fill-current')} />
              赞同 {reply.likes}
            </button>
            {canDelete ? (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className={cn(actionButtonClass, 'border-border/55 bg-white/72 text-muted-foreground hover:bg-white hover:text-foreground dark:bg-white/5')}>
                  <Pencil className="h-3.5 w-3.5" />
                  编辑
                </button>
                <button type="button" onClick={() => void handleDelete()} className={cn(actionButtonClass, 'border-red-500/15 bg-red-500/10 text-red-500 hover:bg-red-500/15')}>
                  <Trash2 className="h-3.5 w-3.5" />
                  删除
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
